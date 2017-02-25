import Component, { React } from '../component';

import Page from '../page';
import Container from '../container';

export default class NotFound extends Component<{}, {}> {
	
	render() {
		return (
			<Page className="notfound" title="Page Not Found">
				<Container>
					<h1>Page Not Found</h1>
				</Container>
			</Page>
		);
	}
}
