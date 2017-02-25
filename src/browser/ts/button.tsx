import Component, { React } from './component';

export default class Button extends Component<{
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}, {}> {
	
	render() {
		return (
			<div className={this.className('button', this.props.disabled ? 'disabled' : null, this.props.className)} onClick={this.props.disabled ? null : this.props.onClick}>
				{this.props.children}
			</div>
		);
	}
	
}
