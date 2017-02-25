import Component, { React } from '../component';
import { browserHistory } from 'react-router';

import Page from '../page';
import Container from '../container';

export interface CreateProps {
	params: {
		id?: string;
	};
}

export default class Create extends Component<CreateProps, {}> {
	
	componentPropsChanged(nextProps: CreateProps) {
		if (!nextProps.params.id) {
			return this.init().catch(this.catch);
		}
		this.catchUpdate();
	}
	
	componentWillMount() {
		if (!this.uid) {
			return browserHistory.push('/');
		}
		if (!this.props.params.id) {
			return this.init().catch(this.catch);
		}
	}
	
	async init() {
		const ref = await this.push(this.ref('replays'), {
			uid: this.uid
		});
		browserHistory.push(`/create/${ref.key}`);
	}
	
	render() {
		return (
			<Page className="create" title="Create">
				<Container>
					<h1>Create {this.props.params.id}</h1>
				</Container>
			</Page>
		);
	}
}
