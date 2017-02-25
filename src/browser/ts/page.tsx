import Component, { React } from './component';
import { browserHistory } from 'react-router';

export default class Page extends Component<{
	title?: string;
	redirect?: string;
	className?: string;
	disabled?: boolean;
	board?: string;
	content?: JSX.Element;
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
				{this.props.children}
			</div>
		);
	}
}
