import Component, { React } from '../component';

import Page from '../page';

export default class NotFound extends Component<{}, {}> {
	
	render() {
		return (
			<Page className="notfound" title="Page Not Found">
				<h1>Page Not Found</h1>
			</Page>
		);
	}
}
