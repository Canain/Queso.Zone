import * as React from 'react';
import { Component as ReactComponent, CSSProperties } from 'react';
import * as shallowequal from 'shallowequal';
import * as firebase from 'firebase';

export type DataSnapshot = firebase.database.DataSnapshot;
export type Reference = firebase.database.Reference;

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
	
	get uid() {
		const currentUser = firebase.auth().currentUser;
		return currentUser ? currentUser.uid : null;
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
}

export default Component;
