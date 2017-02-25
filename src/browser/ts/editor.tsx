import Component, { React } from './component';
import RunIcon from 'react-icons/md/build';

import * as styles from './styles';
import Container from './container';
import Button from './button';

export default class Editor extends Component<{
	disabled?: boolean;
	code: string;
	output: string;
	onCode?: React.EventHandler<React.ChangeEvent<HTMLTextAreaElement>>;
	onCodeDown?: React.EventHandler<React.KeyboardEvent<HTMLTextAreaElement>>;
	onCodeSelect?: React.EventHandler<React.SyntheticEvent<HTMLTextAreaElement>>;
	onCodeRef?: (ref: HTMLTextAreaElement) => void;
}, {}> {
	render() {
		return (
			<div>
				<Container>
					<div className="box">
						<div className="editor">
							<Button>
								<RunIcon size={styles.editorIconSize}/>
							</Button>
							{this.props.children}
						</div>
						<hr/>
						<textarea className="code" disabled={this.props.disabled} value={this.props.code} onChange={this.props.onCode} onKeyDown={this.props.onCodeDown} onSelect={this.props.onCodeSelect} ref={this.props.onCodeRef}/>
					</div>
				</Container>
				<Container>
					<textarea className="output box" disabled={true} value={`Output:\n${this.props.output || ''}`}/>
				</Container>
			</div>
		);
	}
}
