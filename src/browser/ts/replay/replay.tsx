import Component, { React, DataSnapshot } from '../component';

import Page from '../page';
import Container from '../container';

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
}> {
	
	componentWillMount() {
		if (!this.props.params.id) {
			return;
		}
		this.init().catch(this.catch);
	}
	
	async init() {
		const data = await this.getReplay(this.props.params.id).once('value') as DataSnapshot;
		const val = data.val();
	}
	
	render() {
		return (
			<Page redirect={this.props.params ? null : '/'} className="replay" title="Replay">
				<Container>
					<h3>{}</h3>
				</Container>
			</Page>
		);
	}
}
