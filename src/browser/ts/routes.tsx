import Component, { React } from './component';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as ReactGA from 'react-ga';

import Welcome from './welcome/welcome';
import Replay from './replay/replay';
import NotFound from './notfound/notfound';
import Record from './record/record';

// ReactGA.initialize('', {
// 	debug: process.env.NODE_ENV !== 'production'
// });

export default class Routes extends Component<{}, {}> {
	
	onUpdate() {
		ReactGA.set({page: window.location.pathname});
		ReactGA.pageview(window.location.pathname);
	}
	
	render() {
		return (
			<Router history={browserHistory} onUpdate={this.attach(this.onUpdate)}>
				<Route path="/" component={Welcome}/>
				<Route path="/r(/:id)" component={Replay}/>
				<Route path="/record(/:id)" component={Record}/>
				<Route path='*' component={NotFound}/>
			</Router>
		);
	}
}
