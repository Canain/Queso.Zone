import Component, { React } from './component';

export default class Container extends Component<{
	className?: string;
	id?: string;
}, {}> {
	render() {
		return (
			<div id={this.props.id} className={this.className('container', this.props.className)}>
				{this.props.children}
			</div>
		);
	}
}
