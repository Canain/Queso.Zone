import Component, { React, CSSProperties } from './component';

export default class RelativeTime extends Component<{
	start: number;
	className?: string;
}, {
	text?: string;
}> {
	
	running = false;
	
	constructor() {
		super();
		
		this.state = {
			text: ''
		};
	}
	
	componentWillMount() {
		this.running = true;
		this.animate().catch(this.catch);
	}
	
	async animate() {
		while (this.running) {
			const newText = this.formatTime(this.now - this.props.start);
			if (newText !== this.state.text) {
				await this.update({
					text: newText
				});
			}
			await this.animationFrame();
		}
	}
	
	componentWillUnmount() {
		this.running = false;
	}
	
	render() {
		return <span className={this.props.className}>{this.state.text}</span>;
	}
}
