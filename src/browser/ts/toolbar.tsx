import Component, { React } from './component';
import { Link } from 'react-router';

import Container from './container';

export default class Toolbar extends Component<{}, {}> {
	
	render() {
		return (
			<div className="toolbar">
				<Container>
					<div>
						<Link to="/"><h1>Queso</h1></Link>
					</div>
					<div>
						<Link to="/"><h2>Login</h2></Link>
					</div>
				</Container>
			</div>
		);
	}
}
