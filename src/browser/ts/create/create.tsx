import Component, { React, Reference, DataSnapshot } from '../component';
import { browserHistory } from 'react-router';
import RecordIcon from 'react-icons/md/fiber-manual-record';
import RunIcon from 'react-icons/md/play-arrow';
import StopIcon from 'react-icons/md/stop';

import * as styles from '../styles';
import Page from '../page';
import Container from '../container';
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
	
	replay: Reference;
	
	componentPropsChanged(nextProps: CreateProps) {
		if (!nextProps.params.id) {
			return this.init().catch(this.catch);
		}
		this.replay = this.ref('replays').child(nextProps.params.id);
		this.updateInitial().then(() => this.update()).catch(this.catch);
	}
	
	componentWillMount() {
		if (!this.uid) {
			return browserHistory.push('/');
		}
		if (!this.props.params.id) {
			return this.init().catch(this.catch);
		}
		this.replay = this.ref('replays').child(this.props.params.id);
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
		await this.set(this.replay.child('name'), name);
	}
	
	async onCode(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const code = e.target.value;
		await this.update({
			code
		});
		await this.set(this.state.recording ? this.replay.child('code').child((this.now - this.state.start).toString().replace(/\./g, '-')) : this.replay.child('initial'), code);
	}
	
	async init() {
		const ref = await this.push(this.ref('replays'), {
			uid: this.uid
		});
		browserHistory.push(`/create/${ref.key}`);
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
		}), this.set(this.replay.child('recording'), true)]);
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
				<Container>
					<div className="box">
						<div className="editor">
							<Button>
								<RunIcon size={styles.editorIconSize}/>
							</Button>
							{this.state.recording ? 
								<Button onClick={this.attach(this.onStop)}>
									<StopIcon size={styles.editorIconSize} color={styles.editorRecordColor}/>
								</Button> :
								<Button disabled={this.state.done} onClick={this.attach(this.onRecord)}>
									<RecordIcon size={styles.editorIconSize} color={styles.editorRecordColor}/>
								</Button>
							}
						</div>
						<hr/>
						<textarea className="code" disabled={this.state.done} value={this.state.code || ''} onChange={this.attach(this.onCode)} onKeyDown={this.attach(this.onCodeDown)}/>
					</div>
				</Container>
				<Container>
					<textarea className="output box" disabled={true} value={`Output:\n${this.state.output || ''}`}/>
				</Container>
			</Page>
		);
	}
}
