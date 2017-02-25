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

export interface CreateProps {
	params: {
		id?: string;
	};
}

export default class Create extends Component<CreateProps, {
	output?: string;
	name?: string;
	code?: string;
	recording?: boolean;
	done?: boolean;
	start?: number;
}> {
	
	code: HTMLTextAreaElement;
	
	replay: Reference;
	
	componentPropsChanged(nextProps: CreateProps) {
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
		const val = data.val();
		await this.update({
			done: val.recording,
			name: val.name,
			code: val.initial
		});
	}
	
	async onName(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		await this.update({
			name
		});
		await this.set(this.getReplayName(this.replay), name);
	}
	
	async onCode(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const code = e.target.value;
		await this.update({
			code
		});
		await this.set(this.state.recording ? this.getReplayCode(this.replay, this.now - this.state.start) : this.getReplayInitial(this.replay), code);
	}
	
	async onCodeSelect(e: React.SyntheticEvent<HTMLTextAreaElement>) {
		const target = e.target as HTMLTextAreaElement;
		if (!this.state.recording) {
			return;
		}
		
		const { selectionStart, selectionEnd } = target;
		await this.set(this.getReplaySelect(this.replay, this.now - this.state.start), {
			selectionStart,
			selectionEnd
		});
	}
	
	async init() {
		const ref = await this.push(this.replays, {
			uid: this.uid
		});
		browserHistory.push(this.getCreateUrl(ref.key));
	}
	
	onCodeDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.keyCode === 9 || e.which === 9) {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			target.value = target.value.substring(0, start) + '\t' + target.value.substring(target.selectionEnd);
			target.selectionEnd = start + 1;
		}
	}
	
	async onRecord() {
		await Promise.all([this.update({
			recording: true,
			start: this.now
		}), this.set(this.getReplayRecording(this.replay), true)]);
		this.code.focus();
	}
	
	async onStop() {
		await this.update({
			recording: false,
			done: true
		});
	}
	
	render() {
		return (
			<Page className="create" title="Create">
				<Container>
					<input placeholder="Tutorial Name" value={this.state.name || ''} onChange={this.attach(this.onName)} disabled={this.state.done}/>
				</Container>
				<Editor disabled={this.state.done} code={this.state.code || ''} onCode={this.attach(this.onCode)} onCodeDown={this.attach(this.onCodeDown)} onCodeSelect={this.attach(this.onCodeSelect)} output={this.state.output} onCodeRef={ref => this.code = ref}>
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
							<RecordIcon size={styles.editorIconSize} color={styles.editorRecordColor}/>
						</Button>
					}
				</Editor>
			</Page>
		);
	}
}
