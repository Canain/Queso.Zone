import Component, { React, DataSnapshot } from '../component';

import Page from '../page';
import Container from '../container';
import Editor from '../editor';

export interface CodeReplay {
	[time: string]: string;
}

export default class Replay extends Component<{
	params: {
		id?: string;
	};
}, {
	code?: string;
	initial?: string;
	name?: string;
	replay?: CodeReplay;
	output?: string;
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
		await this.update({
			initial,
			code: initial,
			name,
			replay: code
		});
	}
	
	render() {
		return (
			<Page redirect={this.props.params ? null : '/'} className="replay" title="Replay">
				<Container>
					<h3>{this.state.name}</h3>
				</Container>
				<Editor code={this.state.code} output={this.state.output}/>
			</Page>
		);
	}
}
