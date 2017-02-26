import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import * as SocketIO from 'socket.io';
import * as dotenv from 'dotenv';

import * as constants from '../common/constants';
import Base from './base';
import Client from './client';

dotenv.config({
	silent: true
});

class Server extends Base {
	
	io = SocketIO();
	port = parseInt(process.env.PORT || '8090')
	
	async run() {
		await this.mkdirp(this.ws);
		
		this.io.on('connection', socket => new Client(socket));
		
		this.io.listen(this.port);
	}
}

new Server().run();
