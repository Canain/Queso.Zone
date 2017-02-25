import Component, { React } from '../component';

import Page from '../page';

export default class Replay extends Component<{
	params: {
		id?: string;
	};
}, {}> {
	
	render() {
		return (
			<Page redirect={this.props.params ? null : '/'} className="replay" title="Replay">
				<h1>Replay</h1>
			</Page>
		);
	}
}
