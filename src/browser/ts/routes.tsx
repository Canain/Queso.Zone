import Component, { React } from './component';
import { Router, Route, Link, browserHistory } from 'react-router';
import * as ReactGA from 'react-ga';

import Welcome from './welcome/welcome';
import Replay from './replay/replay';
import NotFound from './notfound/notfound';
import Create from './create/create';

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
				<Route path="/create(/:id)" component={Create}/>
				<Route path='*' component={NotFound}/>
			</Router>
		);
	}
}
