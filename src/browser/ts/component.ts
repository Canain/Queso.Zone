import * as React from 'react';
import { Component as ReactComponent, CSSProperties } from 'react';
import * as shallowequal from 'shallowequal';
import * as firebase from 'firebase';
import * as moment from 'moment';

import generatePushID from './generatepushid';

export type DataSnapshot = firebase.database.DataSnapshot;
export type Reference = firebase.database.Reference;

export type ReplayId = string | Reference;

export { React, CSSProperties };

interface Component<P, S> {
	componentPropsChanged(nextProps: P);
}

abstract class Component<P, S> extends ReactComponent<P, S> {
	
	catch = (e: Error) => this.report(e);
	
	constructor() {
		super();
		
		this.state = {} as S;
	}
	
	get replays() {
		return this.ref('replays');
	}
	
	getReplay(id: ReplayId) {
		return typeof id === 'string' ? this.replays.child(id) : id;
	}
	
	getReplayUid(id: ReplayId) {
		return this.getReplay(id).child('uid');
	}
	
	getReplayName(id: ReplayId) {
		return this.getReplay(id).child('name');
	}
	
	getReplayInitial(id: ReplayId) {
		return this.getReplay(id).child('initial');
	}
	
	getReplayCode(id: ReplayId, offset: number) {
		return this.getReplay(id).child('code').child(this.normalizeNumber(offset));
	}
	
	getReplaySelect(id: ReplayId, offset: number) {
		return this.getReplay(id).child('select').child(this.normalizeNumber(offset));
	}
	
	normalizeNumber(num: number) {
		return num.toString().replace(/\./g, '-');
	}
	
	normalizedToNumber(normalized: string) {
		return parseFloat(normalized.replace(/\-/g, '.'));
	}
	
	getReplayRecording(id: ReplayId) {
		return this.getReplay(id).child('recording');
	}
	
	formatTime(time: number) {
		return moment().hour(0).minute(0).second(time / 1000).format('HH:mm:ss');
	}
	
	get recordUrl() {
		return '/record';
	}
	
	getRecordUrl(id: string) {
		return `${this.recordUrl}/${id}`;
	}
	
	getReplayUrl(id: string) {
		return `/r/${id}`;
	}
	
	componentWillReceiveProps(nextProps: P) {
		if (!this.componentPropsChanged) {
			return;
		}
		if (!shallowequal(this.props, nextProps)) {
			this.componentPropsChanged(nextProps);
		}
	}
	
	className(...classes: string[]) {
		return classes.filter(c => !!c).map(c => c.trim()).join(' ');
	}
	
	timeout(milliseconds: number) {
		return new Promise<void>(resolve => window.setTimeout(resolve, milliseconds));
	}
	
	animationFrame() {
		return new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
	}
	
	update(state?: S) {
		if (state) {
			return new Promise<void>(resolve => this.setState(state, resolve));
		}
		return new Promise<void>(resolve => this.forceUpdate(resolve));
	}
	
	shouldComponentUpdate(nextProps: P, nextState: S) {
		return !shallowequal(this.props, nextProps) || !shallowequal(this.state, nextState);
	}
	
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
	
	catchUpdate(state?: S) {
		return this.update(state).catch(this.catch);
	}
	
	attachUpdate(state?: S) {
		return () => this.catchUpdate(state);
	}
	
	get now() {
		return window.performance.now();
	}
	
	get uid() {
		const currentUser = firebase.auth().currentUser;
		return currentUser ? currentUser.uid : null;
	}
	
	pushRef(ref: Reference) {
		return ref.child(generatePushID());
	}
	
	ref(path: string) {
		return firebase.database().ref(path);
	}
	
	set(ref: firebase.database.Reference, data) {
		return ref.set(data).catch(error => 
			Promise.reject(
				JSON.stringify(
					Object.assign({}, error, {
						data: data,
						type: 'set',
						path: ref.toString()
					})
				)
			)
		) as Promise<void>;
	}
	
	push(ref: firebase.database.Reference, data) {
		return ref.push(data).catch(error => 
			Promise.reject(
				JSON.stringify(
					Object.assign({}, error, {
						data: data,
						type: 'push',
						path: ref.toString()
					})
				)
			)
		) as Promise<firebase.database.Reference>;
	}
	
	put(ref: firebase.database.Reference, data) {
		return ref.update(data).catch(error => 
			Promise.reject(
				JSON.stringify(
					Object.assign({}, error, {
						data: data,
						type: 'update',
						path: ref.toString()
					})
				)
			)
		) as Promise<void>;
	}
}

export default Component;
