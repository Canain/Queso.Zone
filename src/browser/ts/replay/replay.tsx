import Component, { React, DataSnapshot, Socket } from '../component';
import PlayIcon from 'react-icons/md/play-arrow';
import StopIcon from 'react-icons/md/stop';
import * as SocketIOClient from 'socket.io-client';

import * as styles from '../styles';
import Page from '../page';
import Container from '../container';
import Editor from '../editor';
import Button from '../button';
import RelativeTime from '../relativetime';
import Progress from '../progress';

export interface Code {
	code: string;
	history;
}

export interface CodeReplay {
	time: number;
	code: Code;
}

export interface SelectReplay {
	time: number;
	selection: { anchor: CodeMirror.Position; head: CodeMirror.Position };
}

export interface OutputReplay {
	time: number;
	output: string;
}

export default class Replay extends Component<{
	params: {
		id?: string;
	};
}, {
	code?: string;
	initial?: Code;
	name?: string;
	replay?: CodeReplay[];
	select?: SelectReplay[];
	out?: OutputReplay[];
	output?: string;
	playing?: boolean;
	started?: number;
	time?: number;
	audio?: HTMLAudioElement;
	loaded?: boolean;
	dependencies?: string;
}> {
	
	socket: Socket;
	
	code: ReactCodeMirror.ReactCodeMirror;
	
	componentWillMount() {
		if (!this.props.params.id) {
			return;
		}
		this.init().catch(this.catch);
	}
	
	async init() {
		const data = await this.getReplay(this.props.params.id).once('value') as DataSnapshot;
		const { initial, code, select: selects, name, audio, output, dependencies } = data.val();
		const replay = [] as CodeReplay[];
		for (const i in code) {
			const c = code[i];
			replay.push({
				time: this.normalizedToNumber(i),
				code: {
					code: c.code,
					history: JSON.parse(c.history)
				}
			});
		}
		replay.sort((a, b) => a.time - b.time);
		const select = [] as SelectReplay[];
		for (const i in selects) {
			const selection = JSON.parse(selects[i]);
			select.push({
				time: this.normalizedToNumber(i),
				selection
			});
		}
		select.sort((a, b) => a.time - b.time);
		const out = [] as OutputReplay[];
		for (const i in output) {
			out.push({
				time: this.normalizedToNumber(i),
				output: output[i]
			});
		}
		out.sort((a, b) => a.time - b.time);
		if (initial) {
			initial.history = JSON.parse(initial.history);
		}
		
		this.socket = SocketIOClient(this.server);
		this.socket.on('out', this.attach(this.onOut));
		this.socket.on('err', this.attach(this.onErr));
		this.socket.emit('replay', this.pushRef(this.replays).key, this.props.params.id);
		await this.wait('replay');
		
		await this.update({
			initial,
			code: initial ? initial.code : '',
			name,
			replay,
			select,
			out,
			dependencies,
			audio: new Audio(await this.decompress(audio as string)),
			loaded: true
		});
		if (initial) {
			this.code.getCodeMirror().getDoc().setHistory(this.state.initial.history);
		}
	}
	
	async onOut(out: string) {
		const now = this.now;
		await this.update({
			output: this.state.output + out
		});
	}
	
	async onErr(err: string) {
		const now = this.now;
		await this.update({
			output: this.state.output + err
		});
	}
	
	async onCompile() {
		this.socket.emit('compile', this.state.code);
		await this.update({
			output: this.getCompileLine(this.state.output)
		});
	}
	
	wait(event: string) {
		return new Promise<void>(resolve => this.socket.once(event, resolve));
	}
	
	async animate() {
		do {
			if (!this.code) {
				return;
			}
			this.code.focus();
			let lastCode = null as CodeReplay;
			const now = this.now - this.state.started;
			for (let i = 0; i < this.state.replay.length; i++) {
				const replay = this.state.replay[i];
				if (replay.time > now) {
					break;
				}
				lastCode = replay;
			}
			let lastSelect = null as SelectReplay;
			for (let j = 0; j < this.state.select.length; j++) {
				const select = this.state.select[j];
				if (select.time > now) {
					break;
				}
				lastSelect = select;
			}
			let lastOut = null as OutputReplay;
			for (let k = 0; k < this.state.out.length; k++) {
				const out = this.state.out[k];
				if (out.time > now) {
					break;
				}
				lastOut = out;
			}
			await Promise.all([this.update({
				code: lastCode ? lastCode.code.code : this.state.initial.code,
				output: lastOut ? lastOut.output : '',
				playing: !this.state.audio.paused,
				time: now
			}).then(() => {
				this.code.getCodeMirror().getDoc().setHistory(lastCode ? lastCode.code.history : this.state.initial.history);
				if (lastSelect) {
					this.code.getCodeMirror().getDoc().setSelection(lastSelect.selection.anchor, lastSelect.selection.head);
				}
			}), this.animationFrame()]);
		} while (this.state.playing);
	}
	
	async onPlay() {
		await this.update({
			playing: true,
			started: this.now
		});
		this.state.audio.currentTime = 0;
		this.state.audio.play();
		await this.animate();
	}
	
	async onStop() {
		this.state.audio.pause();
		await this.update({
			playing: false
		});
	}
	
	render() {
		return (
			<Page redirect={this.props.params ? null : '/'} className="replay" title="Replay">
				{!this.state.loaded ? <Progress/> :
					<Container>
						<input value={this.state.name || 'Untitled'} disabled={true}/>
					</Container>
				}
				{!this.state.loaded ? null :
					<Container>
						<div className="editor box">
							{this.state.playing ? 
								<Button onClick={this.attach(this.onStop)}>
									<StopIcon size={styles.editorIconSize}/>
								</Button> :
								<Button onClick={this.attach(this.onPlay)}>
									<PlayIcon size={styles.editorIconSize}/>
								</Button>
							}
							<div className="clock">
								<span>{this.formatTime(this.state.time || 0)}</span>
							</div>
						</div>
					</Container>
				}
				{!this.state.loaded ? null :
					<Container>
						<Editor code={this.state.code} output={this.state.output} onCodeRef={ref => this.code = ref} onCompile={this.attach(this.onCompile)} onCode={code => this.catchUpdate({code})} dependencies={this.state.dependencies}/>
					</Container>
				}
			</Page>
		);
	}
}
