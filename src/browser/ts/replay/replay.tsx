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

export default class Replay extends Component<{
	params: {
		id?: string;
	};
}, {
	code?: string;
	initial?: string;
	name?: string;
	replay?: CodeReplay[];
	output?: string;
	playing?: boolean;
	started?: number;
}> {
	
	componentWillMount() {
		if (!this.props.params.id) {
			return;
		}
		this.init().catch(this.catch);
	}
	
	async init() {
		const data = await this.getReplay(this.props.params.id).once('value') as DataSnapshot;
		const { initial, code, name } = data.val();
		const replay = [] as CodeReplay[];
		for (const i in code) {
			replay.push({
				time: parseFloat(i.replace(/\-/g, '.')),
				code: code[i]
			});
		}
		replay.sort((a, b) => a.time - b.time);
		await this.update({
			initial,
			code: initial,
			name,
			replay
		});
	}
	
	async animate() {
		do {
			let last = null as CodeReplay;
			const now = this.now - this.state.started;
			let i;
			for (i = 0; i < this.state.replay.length; i++) {
				const replay = this.state.replay[i];
				if (replay.time > now) {
					break;
				}
				last = replay;
			}
			await Promise.all([this.update({
				code: last ? last.code : this.state.initial,
				playing: i !== this.state.replay.length
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
					<h3>{this.state.name}</h3>
				</Container>
				<Editor code={this.state.code} output={this.state.output}/>
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
