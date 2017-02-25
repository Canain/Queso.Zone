import Component, { React, Reference, DataSnapshot } from '../component';
import { Link, browserHistory } from 'react-router';
import RecordIcon from 'react-icons/md/fiber-manual-record';
import StopIcon from 'react-icons/md/stop';
import ViewIcon from 'react-icons/md/pageview';

import * as styles from '../styles';
import Page from '../page';
import Container from '../container';
import Editor from '../editor';
import Button from '../button';
import RelativeTime from '../relativetime';

export interface RecordProps {
	params: {
		id?: string;
	};
}

export default class Record extends Component<RecordProps, {
	output?: string;
	name?: string;
	code?: string;
	recording?: boolean;
	done?: number;
	start?: number;
}> {
	
	code: ReactCodeMirror.ReactCodeMirror;
	
	replay: Reference;
	
	componentPropsChanged(nextProps: RecordProps) {
		if (!nextProps.params.id) {
			return this.init().catch(this.catch);
		}
		this.replay = this.getReplay(nextProps.params.id);
		this.updateInitial().then(() => this.update()).catch(this.catch);
	}
	
	componentWillMount() {
		if (!this.uid) {
			return browserHistory.push('/');
		}
		if (!this.props.params.id) {
			return this.init().catch(this.catch);
		}
		this.replay = this.getReplay(this.props.params.id);
		this.updateInitial().catch(this.catch);
	}
	
	async updateInitial() {
		const data = await this.replay.once('value') as DataSnapshot;
		const val = data.val() || {};
		await this.update({
			done: val.recording,
			name: val.name,
			code: val.initial ? val.initial.code : ''
		});
		if (val.initial) {
			this.code.getCodeMirror().getDoc().setHistory(JSON.parse(val.initial.history));
		}
	}
	
	async onName(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		await this.update({
			name
		});
		await this.set(this.getReplayName(this.replay), name);
	}
	
	async onCode(code: string) {
		const now = this.now;
		await this.update({
			code
		});
		const send = {
			code,
			history: JSON.stringify(this.code.getCodeMirror().getDoc().getHistory())
		};
		if (this.state.recording) {
			if (!this.state.start) {
				await this.update({
					start: now
				});
			}
			const offset = now - this.state.start;
			await this.set(this.getReplayCode(this.replay, offset), send);
			return;
		}
		await this.set(this.getReplayInitial(this.replay), send);
	}
	
	onCursorAttached = this.attach(this.onCursor);
	
	async onCursor(editor: CodeMirror.Editor) {
		const now = this.now;
		if (!this.state.recording) {
			return;
		}
		const doc = editor.getDoc();
		const anchor = doc.getCursor('anchor');
		const head = doc.getCursor('head');
		const send = {
			anchor: {
				line: anchor.line,
				ch: anchor.ch
			},
			head: {
				line: head.line,
				ch: head.ch
			}
		};
		if (!this.state.start) {
			await this.update({
				start: now
			});
		}
		await this.set(this.getReplaySelect(this.replay, now - this.state.start), JSON.stringify(send));
	}
	
	async init() {
		browserHistory.push(this.getRecordUrl(this.pushRef(this.replays).key));
	}
	
	async onRecord() {
		await this.set(this.getReplayUid(this.replay), this.uid);
		await this.set(this.getReplayInitial(this.replay), {
			code: this.state.code || '',
			history: JSON.stringify(this.code.getCodeMirror().getDoc().getHistory())
		})
		await Promise.all([this.update({
			recording: true,
			start: null
		}), this.set(this.getReplayRecording(this.replay), true)]);
		this.code.focus();
	}
	
	async onStop() {
		await this.update({
			recording: false,
			done: this.now - this.state.start
		});
	}
	
	render() {
		return (
			<Page className="record" title="Record">
				<Container>
					<input placeholder="Tutorial Name" value={this.state.name || ''} onChange={this.attach(this.onName)} disabled={!!this.state.done}/>
				</Container>
				<Container>
					<div className="editor box">
						{this.state.recording ? 
							<Button onClick={this.attach(this.onStop)}>
								<StopIcon size={styles.editorIconSize} color={styles.editorRecordColor}/>
							</Button> :
							this.state.done ? 
							<div>
								<Link to={this.getReplayUrl(this.props.params.id)}>
									<ViewIcon size={styles.editorIconSize}/>
								</Link>
							</div> :
							<Button onClick={this.attach(this.onRecord)}>
								<RecordIcon size={styles.editorIconSize}/>
							</Button>
						}
						<div className="clock">
							{this.state.start ? 
								this.state.done ?
									<span>{this.formatTime(this.state.done)}</span> :
									<RelativeTime start={this.state.start}/>
								 : '00:00:00'
							}
						</div>
					</div>
				</Container>
				<Container>
					<Editor disabled={!!this.state.done} code={this.state.code || ''} onCode={this.attach(this.onCode)} output={this.state.output} onCodeRef={ref => {
						this.code = ref;
						if (this.code) {
							this.code.getCodeMirror().off('cursorActivity', this.onCursorAttached);
							this.code.getCodeMirror().on('cursorActivity', this.onCursorAttached);
						}
					}}/>
				</Container>
			</Page>
		);
	}
}
