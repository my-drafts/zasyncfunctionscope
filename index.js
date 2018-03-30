#!/usr/bin/env node

'use strict';

const Scope = require('zscope').Scope;
const AsyncFunction = (async function () {}).constructor;

class AsyncFunctionsScope extends Scope {

	static init (...args) {
		return Object.freeze(new AsyncFunctionsScope(...args));
	};

	setItem (key, value) {
		if (value instanceof AsyncFunction) return super.setItem(key, value);
		throw new Error('AsyncFunctionsScope.setItem got value not a AsyncFunction');
	}

	apply (key, args) {
		if (!(args instanceof Array))args = [args];
		if (this.hasItem(key)) return (this.getItem(key))(...args);
		throw new Error('AsyncFunctionsScope.apply called with key not in Scope');
	}

	call (key, ...args) {
		if (this.hasItem(key)) return (this.getItem(key))(...args);
		throw new Error('AsyncFunctionsScope.call called with key not in Scope');
	}

}

exports.AsyncFunctionsScope = AsyncFunctionsScope;
exports.AsyncFunction = AsyncFunction;

