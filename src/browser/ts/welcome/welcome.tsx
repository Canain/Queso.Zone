import Component, { React } from '../component';

import Page from '../page';
import Container from '../container';

export default class Welcome extends Component<{}, {}> {
	
	render() {
		return (
			<Page className="welcome" title="Welcome">
				<Container>
					<h1>Welcome</h1>
				</Container>
			</Page>
		);
	}
}
