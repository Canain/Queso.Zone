import Component, { React } from './component';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as ReactGA from 'react-ga';

import Welcome from './welcome/welcome';
import Replay from './replay/replay';
import NotFound from './notfound/notfound';

export default class Routes extends Component<{}, {}> {
	
	onUpdate() {
		ReactGA.set({page: window.location.pathname});
		ReactGA.pageview(window.location.pathname);
	}
	
	render() {
		return (
			<Router history={browserHistory} onUpdate={this.attach(this.onUpdate)}>
				<Route path="/" component={Welcome}/>
				<Route path="/r(/:replay)" component={Replay}/>
				<Route path='*' component={NotFound}/>
			</Router>
		);
	}
}
