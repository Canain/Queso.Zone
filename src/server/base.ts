import * as mkdirp from 'mkdirp';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { ncp } from 'ncp';

export abstract class Base {
	
	catch = (e: Error) => this.report(e);
	
	attach<T extends Function>(method: T) {
		const self = this;
		const proxy = function () {
			const ret = method.apply(self, arguments) as Promise<any>;
			if (ret) {
				return ret.catch(self.catch);
			}
			return ret;
		} as any;
		return proxy as T;
	}
	
	report(e: Error) {
		console.error(e);
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
	
	get ws() {
		return `${process.cwd()}/ws`;
	}
	
	writeFile(file: string, content: string) {
		return new Promise<void>((resolve, reject) => fs.writeFile(file, content, e => e ? reject(e) : resolve()));
	}
	
	rm(path: string) {
		return new Promise<void>((resolve, reject) => rimraf(path, e => e ? reject(e) : resolve()));
	}
	
	cp(src: string, dst: string) {
		return new Promise<void>((resolve, reject) => ncp(src, dst, e => e? reject(e) : resolve()))
	}
}

export default Base;
