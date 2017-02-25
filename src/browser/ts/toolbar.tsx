import Component, { React } from './component';
import { Link } from 'react-router';
import * as firebase from 'firebase';

import Container from './container';
import Button from './button';

export default class Toolbar extends Component<{}, {
	disabled?: boolean;
	loggedIn?: boolean;
}> {
	
	get loggedIn() {
		return !!firebase.auth().currentUser;
	}
	
	componentWillMount() {
		this.state = {
			loggedIn: this.loggedIn
		};
	}
	
	async onLogin() {
		await this.update({
			disabled: true
		});
		const result = await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
		await this.update({
			disabled: false,
			loggedIn: this.loggedIn
		});
	}
	
	async onLogout() {
		await this.update({
			disabled: true
		});
		await firebase.auth().signOut();
		await this.update({
			disabled: false,
			loggedIn: this.loggedIn
		});
	}
	
	render() {
		return (
			<div className="toolbar">
				<Container>
					<div>
						<Link to="/"><h1>Queso</h1></Link>
					</div>
					<div>
						{!this.state.loggedIn ? null :
							<div>
								<Link to="/create">
									<h2>Create</h2>
								</Link>
							</div>
						}
						{this.state.loggedIn ?
							<Button onClick={this.attach(this.onLogout)} disabled={this.state.disabled}>
								<h2>Logout</h2>
							</Button> :
							<Button onClick={this.attach(this.onLogin)} disabled={this.state.disabled}>
								<h2>Login</h2>
							</Button>
						}
					</div>
				</Container>
			</div>
		);
	}
}
