import Component, { React, DataSnapshot } from './component';

export default class Progress extends Component<{}, {}> {
	render() {
		return (
			<div className="progress">
				<svg version="1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 24 24">
				<path id="indeterminate" d="M12 3.25A8.75 8.75 0 1 1 3.25 12" fill="none" stroke-width="1.5" stroke-linecap="square" stroke="#2196F3"/>
				</svg>
			</div>
		);
	}
}
