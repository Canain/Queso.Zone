const CompressorWorker = require('worker-loader?inline!./worker.js');

export default class Compressor {
	
	tasks = [] as ((data) => void)[];
	
	id = 0;
	worker = new CompressorWorker() as Worker;
	
	constructor() {
		this.worker.onmessage = data => this.onMessage(data);
	}
	
	onMessage(message: MessageEvent) {
		const id = message.data.id as number;
		this.tasks[id](message.data.out);
		delete this.tasks[id];
	}
	
	addTask(cmd: string, input, callback: (out) => void) {
		const id = this.id++;
		this.tasks[id] = callback;
		this.worker.postMessage({
			cmd,
			in: input,
			id
		});
	}
	
	compress(data: string) {
		return new Promise<string>(resolve => this.addTask('compress', data, resolve));
	}
	
	decompress(compressed: string) {
		return new Promise<string>(resolve => this.addTask('decompress', compressed, resolve));
	}
}
