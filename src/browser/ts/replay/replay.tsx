import Component, { React, DataSnapshot } from '../component';
import PlayIcon from 'react-icons/md/play-arrow';
import StopIcon from 'react-icons/md/stop';

import * as styles from '../styles';
import Page from '../page';
import Container from '../container';
import Editor from '../editor';
import Button from '../button';
import RelativeTime from '../relativetime';

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
	output?: string;
	playing?: boolean;
	started?: number;
	time?: number;
}> {
	
	code: ReactCodeMirror.ReactCodeMirror;
	
	componentWillMount() {
		if (!this.props.params.id) {
			return;
		}
		this.init().catch(this.catch);
	}
	
	async init() {
		const data = await this.getReplay(this.props.params.id).once('value') as DataSnapshot;
		const { initial, code, select: selects, name } = data.val();
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
		if (initial) {
			initial.history = JSON.parse(initial.history);
		}
		await this.update({
			initial,
			code: initial ? initial.code : '',
			name,
			replay,
			select
		});
		if (initial) {
			this.code.getCodeMirror().getDoc().setHistory(this.state.initial.history);
		}
	}
	
	async animate() {
		do {
			if (!this.code) {
				return;
			}
			this.code.focus();
			let lastCode = null as CodeReplay;
			const now = this.now - this.state.started;
			let i;
			for (i = 0; i < this.state.replay.length; i++) {
				const replay = this.state.replay[i];
				if (replay.time > now) {
					break;
				}
				lastCode = replay;
			}
			let j;
			let lastSelect = null as SelectReplay;
			for (j = 0; j < this.state.select.length; j++) {
				const select = this.state.select[j];
				if (select.time > now) {
					break;
				}
				lastSelect = select;
			}
			await Promise.all([this.update({
				code: lastCode ? lastCode.code.code : this.state.initial.code,
				playing: i !== this.state.replay.length || j !== this.state.select.length,
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
		await this.animate();
	}
	
	async onStop() {
		await this.update({
			playing: false
		});
	}
	
	render() {
		return (
			<Page redirect={this.props.params ? null : '/'} className="replay" title="Replay">
				<Container>
					<input value={this.state.name || ''} disabled={true}/>
				</Container>
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
				<Container>
					<Editor code={this.state.code} output={this.state.output} onCodeRef={ref => this.code = ref}/>
				</Container>
			</Page>
		);
	}
}
