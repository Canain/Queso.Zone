import Component, { React } from './component';
import { browserHistory } from 'react-router';

import Toolbar from './toolbar';

export default class Page extends Component<{
	title?: string;
	redirect?: string;
	className?: string;
}, {}> {
	
	componentWillMount() {
		if (this.props.redirect) {
			return browserHistory.push(this.props.redirect);
		}
		this.updateDocument();
	}
	
	updateDocument() {
		window.document.title = `Queso${this.props.title ? ` | ${this.props.title}` : ''}`;
		window.document.body.className = this.props.className || '';
	}
	
	render() {
		this.updateDocument();
		return (
			<div>
				<Toolbar/>
				{this.props.children}
			</div>
		);
	}
}
