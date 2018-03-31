const Assert = require('assert');
const AsyncFunctionScope = require('./').AsyncFunctionScope;

class Test {
	constructor () {
	};

	run () {
		return [
			this.check_AsyncFunctionScope,
			this.call_ScopeSetItem,
			this.call_ScopeSetItemFail,
			this.call_AsyncFunctionScopeApply,
			this.call_AsyncFunctionScopeCall,
		]
		.map((method) => {
			try {
				method();
				return false;
			}
			catch (E) {
				return E;
			}
		})
		.filter((test) => test)
		.map((error) => error.message);
	};

	check_AsyncFunctionScope () {
		let s = AsyncFunctionScope;
		Assert.ok(s instanceof Object, 'Exporting class "AsyncFunctionScope"');
	};

	call_ScopeSetItem () {
		let s = AsyncFunctionScope.init({'key-1': async function () { }});
		Assert.deepEqual(s.keys, ['key-1'], 'Calling instance method "setItem" of class "AsyncFunctionScope"');
	}

	call_ScopeSetItemFail () {
		try {
			let s = AsyncFunctionScope.init({'key-1': 1});
			throw new Error('Calling constructor of class "AsyncFunctionScope"');
		}
		catch (E) { }
	}

	call_AsyncFunctionScopeApply () {
		let f = async function (a) { return a; };
		let s = AsyncFunctionScope.init({'key-1': f});
		let r = s.apply('key-1', 123);
		Assert.ok(r instanceof Promise, 'Calling instance method "apply" of class "AsyncFunctionScope"');
	}

	call_AsyncFunctionScopeCall () {
		let f = async function (a) { return a; };
		let s = AsyncFunctionScope.init({'key-1': f});
		let r = s.call('key-1', 123);
		Assert.ok(r instanceof Promise, 'Calling instance method "call" of class "AsyncFunctionScope"');
	}
}

const test = new Test();
console.log(test.run());
