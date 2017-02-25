import Component, { React } from './component';
import RunIcon from 'react-icons/md/build';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/mode/python/python';

import * as styles from './styles';
import Container from './container';
import Button from './button';

export default class Editor extends Component<{
	disabled?: boolean;
	code: string;
	output: string;
	onCode?: (newValue: string) => void;
	onCodeRef?: (ref: ReactCodeMirror.ReactCodeMirror) => void;
}, {}> {
	render() {
		return (
			<div className="box">
				<div className="editor">
					<Button>
						<RunIcon size={styles.editorIconSize}/>
					</Button>
					{this.props.children}
				</div>
				<hr/>
				<CodeMirror className="code" value={this.props.code} onChange={this.props.onCode} ref={this.props.onCodeRef} options={{
					mode: 'python',
					lineWrapping: true,
					readOnly: this.props.disabled,
					lineNumbers: true
				}}/>
				<hr/>
				<CodeMirror className="output" value={`Output:\n${this.props.output || ''}`} options={{
					readOnly: true,
					lineNumbers: true
				}}/>
			</div>
		);
	}
}
