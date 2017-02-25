import Component, { React, DataSnapshot } from '../component';
import PlayIcon from 'react-icons/md/play-arrow';
import StopIcon from 'react-icons/md/stop';

import * as styles from '../styles';
import Page from '../page';
import Container from '../container';
import Editor from '../editor';
import Button from '../button';

export interface CodeReplay {
	time: number;
	code: string;
}

export interface SelectReplay {
	time: number;
	selectionStart: number;
	selectionEnd: number;
}

export default class Replay extends Component<{
	params: {
		id?: string;
	};
}, {
	code?: string;
	initial?: string;
	name?: string;
	replay?: CodeReplay[];
	select?: SelectReplay[];
	output?: string;
	playing?: boolean;
	started?: number;
	offset?: number;
}> {
	
	code: HTMLTextAreaElement;
	
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
			replay.push({
				time: parseFloat(i.replace(/\-/g, '.')),
				code: code[i]
			});
		}
		replay.sort((a, b) => a.time - b.time);
		const select = [] as SelectReplay[];
		for (const i in selects) {
			const { selectionStart, selectionEnd } = selects[i];
			select.push({
				time: parseFloat(i.replace(/\-/g, '.')),
				selectionStart,
				selectionEnd
			});
		}
		await this.update({
			initial,
			code: initial,
			name,
			replay,
			select,
			offset: Math.min(replay.length ? replay[0].time : 0, select.length ? select[0].time : 0)
		});
	}
	
	async animate() {
		do {
			this.code.focus();
			let lastCode = null as CodeReplay;
			const now = this.now - this.state.started;
			let i;
			for (i = 0; i < this.state.replay.length; i++) {
				const replay = this.state.replay[i];
				if ((replay.time - this.state.offset) > now) {
					break;
				}
				lastCode = replay;
			}
			let j;
			let lastSelect = null as SelectReplay;
			for (j = 0; j < this.state.select.length; j++) {
				const select = this.state.select[j];
				if ((select.time - this.state.offset) > now) {
					break;
				}
				lastSelect = select;
			}
			await Promise.all([this.update({
				code: lastCode ? lastCode.code : this.state.initial,
				playing: i !== this.state.replay.length || j !== this.state.select.length
			}).then(() => lastSelect ? this.code.setSelectionRange(lastSelect.selectionStart, lastSelect.selectionEnd) : null), this.animationFrame()]);
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
					<h3>{this.state.name}</h3>
				</Container>
				<Editor code={this.state.code} output={this.state.output} onCodeRef={ref => this.code = ref}/>
				<Container className="bottom">
					<div className="editor box">
						{this.state.playing ? 
							<Button onClick={this.attach(this.onStop)}>
								<StopIcon size={styles.editorIconSize}/>
							</Button> :
							<Button onClick={this.attach(this.onPlay)}>
								<PlayIcon size={styles.editorIconSize}/>
							</Button>
						}
					</div>
				</Container>
			</Page>
		);
	}
}
