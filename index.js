#!/usr/bin/env node

'use strict';

const Scope = require('zscope').Scope;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

class AsyncFunctionScope extends Scope {

	static init (...args) {
		return Object.freeze(new AsyncFunctionScope(...args));
	};

	setItem (key, value) {
		if (value instanceof AsyncFunction) return super.setItem(key, value);
		throw new Error('AsyncFunctionScope.setItem got value not a AsyncFunction');
	}

	apply (key, args) {
		if (!(args instanceof Array))args = [args];
		if (this.hasItem(key)) return (this.getItem(key))(...args);
		throw new Error('AsyncFunctionScope.apply called with key not in Scope');
	}

	call (key, ...args) {
		if (this.hasItem(key)) return (this.getItem(key))(...args);
		throw new Error('AsyncFunctionScope.call called with key not in Scope');
	}

}

exports.AsyncFunctionScope = AsyncFunctionScope;
exports.AsyncFunction = AsyncFunction;

