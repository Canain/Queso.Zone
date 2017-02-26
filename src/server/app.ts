import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as childProcess from 'child_process';

import * as constants from '../common/constants';

class Server {
	
	async run() {
		await this.mkdirp(`${process.cwd()}/ws`);
		
		// await this.spawn('python', ['main.py'], `${process.cwd()}/ws/-KdsQ_9X8l1u3c9pmhsO`, o => console.log(o), e => console.error(e));
	}
	
	mkdirp(path: string) {
		return new Promise<void>((resolve, reject) => mkdirp(path, e => e ? reject(e) : resolve()));
	}
	
	spawn(cmd: string, args: string[], cwd: string, stdout: (out: string) => void, stderr: (err: string) => void) {
		return new Promise<void>((resolve, reject) => {
			const child = childProcess.spawn(cmd, args, {cwd});
			child.on('exit', resolve);
			child.stdout.on('data', chunk => stdout(chunk.toString()));
			child.stderr.on('data', chunk => stderr(chunk.toString()));
		});
	}
}

new Server().run();
