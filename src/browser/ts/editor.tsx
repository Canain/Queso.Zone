import Component, { React } from './component';
import RunIcon from 'react-icons/md/build';
import RefreshIcon from 'react-icons/md/cached';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

import * as styles from './styles';
import Container from './container';
import Button from './button';

export default class Editor extends Component<{
	disabled?: boolean;
	code: string;
	output: string;
	dependencies: string;
	onCode?: (newValue: string) => void;
	onCodeRef?: (ref: ReactCodeMirror.ReactCodeMirror) => void;
	onCompile?: () => void;
	onOutputRef?: (ref: ReactCodeMirror.ReactCodeMirror) => void;
	onDependencies?: (newValue: string) => void;
	onInstall?: () => void;
}, {}> {
	render() {
		return (
			<div className="box">
				<div className="editor">
					<Button onClick={this.props.onCompile}>
						<RunIcon size={styles.editorIconSize}/>
					</Button>
					<div className="vr"/>
					<div className="install">
						<h4>npm install</h4>
					</div>
					<input className="dependencies" disabled={this.props.disabled} onChange={e => this.props.onDependencies ? this.props.onDependencies(e.target.value) : null} value={this.props.dependencies || ''}/>
					{!this.props.onInstall ? null :
						<Button onClick={this.props.onInstall}>
							<RefreshIcon size={styles.editorIconSize}/>
						</Button>
					}
				</div>
				<hr/>
				<CodeMirror className="code" value={this.props.code} onChange={this.props.onCode} ref={this.props.onCodeRef} options={{
					mode: 'javascript',
					lineWrapping: true,
					readOnly: this.props.disabled,
					lineNumbers: true
				}}/>
				<hr/>
				<CodeMirror className="output" value={`Output:\n${this.props.output || ''}`} options={{
					mode: 'none',
					readOnly: true,
					lineNumbers: true
				}} ref={this.props.onOutputRef}/>
			</div>
		);
	}
}
