import Component, { React, Reference, DataSnapshot } from '../component';
import { browserHistory } from 'react-router';
import RecordIcon from 'react-icons/md/fiber-manual-record';
import RunIcon from 'react-icons/md/play-arrow';

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
		await this.set(this.replay.child('initial'), code);
	}
	
	async init() {
		const ref = await this.push(this.ref('replays'), {
			uid: this.uid
		});
		browserHistory.push(`/create/${ref.key}`);
	}
	
	render() {
		return (
			<Page className="create" title="Create">
				<Container>
					<input placeholder="Tutorial Name" value={this.state.name || ''} onChange={this.attach(this.onName)}/>
				</Container>
				<Container>
					<div className="box">
						<div className="editor">
							<Button>
								<RunIcon size={styles.editorIconSize}/>
							</Button>
							<Button>
								<RecordIcon size={styles.editorIconSize} color={styles.editorRecordColor}/>
							</Button>
						</div>
						<hr/>
						<textarea className="code" value={this.state.code || ''} onChange={this.attach(this.onCode)}/>
					</div>
				</Container>
				<Container>
					<textarea className="output box" disabled={true} value={`Output:\n${this.state.output || ''}`}/>
				</Container>
			</Page>
		);
	}
}
