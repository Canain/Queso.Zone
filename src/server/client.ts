import Base from './base';

export type Socket = SocketIO.Socket;

export default class Client extends Base {
	
	cleanup?: boolean;
	
	id: string;
	
	constructor(public socket: Socket) {
		super();
		
		this.socket.on('record', this.attach(this.record));
		this.socket.on('replay', this.attach(this.replay));
		this.socket.on('compile', this.attach(this.compile));
		this.socket.on('disconnect', this.attach(this.disconnect));
	}
	
	get dir() {
		return `${this.ws}/${this.id}`;
	}
	
	record(id: string) {
		this.id = id;
		this.mkdirp(this.dir);
		this.socket.emit('record');
	}
	
	replay(id: string, replay: string) {
		this.id = id;
		this.cleanup = true;
		this.cp(`${this.ws}/${replay}`, this.dir);
		this.socket.emit('replay');
	}
	
	async compile(code: string) {
		await this.writeFile(`${this.dir}/main.js`, code);
		await this.spawn('node', ['main.js'], this.dir, out => this.socket.emit('out', out), err => this.socket.emit('err', err));
	}
	
	disconnect() {
		if (this.cleanup) {
			this.rm(this.dir);
		}
	}
	
}
