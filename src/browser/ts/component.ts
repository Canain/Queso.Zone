import * as React from 'react';
import { Component as ReactComponent, CSSProperties } from 'react';
import * as shallowequal from 'shallowequal';

export { React, CSSProperties };

abstract class Component<P, S> extends ReactComponent<P, S> {
	
	catch = (e: Error) => this.report(e);
	
	constructor() {
		super();
		
		this.state = {} as S;
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
	
	async handleError(error: Error) {
		console.error(error);
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
}

export default Component;
