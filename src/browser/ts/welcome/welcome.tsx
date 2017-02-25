import Component, { React } from '../component';

import Page from '../page';

export default class Welcome extends Component<{}, {}> {
	
	render() {
		return (
			<Page className="welcome" title="Welcome">
				<h1>Welcome</h1>
			</Page>
		);
	}
}
