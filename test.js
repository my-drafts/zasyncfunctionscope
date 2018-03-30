const Assert = require('assert');
const AsyncFunctionsScope = require('./').AsyncFunctionsScope;

class Test {
	constructor () {
	};

	run () {
		return [
			this.check_AsyncFunctionsScope,
			this.call_ScopeSetItem,
			this.call_ScopeSetItemFail,
			this.call_AsyncFunctionsScopeApply,
			this.call_AsyncFunctionsScopeCall,
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

	check_AsyncFunctionsScope () {
		let s = AsyncFunctionsScope;
		Assert.ok(s instanceof Object, 'Exporting class "AsyncFunctionsScope"');
	};

	call_ScopeSetItem () {
		let s = AsyncFunctionsScope.init({'key-1': async function () { }});
		Assert.deepEqual(s.keys, ['key-1'], 'Calling instance method "setItem" of class "AsyncFunctionsScope"');
	}

	call_ScopeSetItemFail () {
		try {
			let s = AsyncFunctionsScope.init({'key-1': 1});
			throw new Error('Calling constructor of class "AsyncFunctionsScope"');
		}
		catch (E) { }
	}

	call_AsyncFunctionsScopeApply () {
		let f = async function (a) { return a; };
		let s = AsyncFunctionsScope.init({'key-1': f});
		let r = s.apply('key-1', 123);
		Assert.ok(r instanceof Promise, 'Calling instance method "apply" of class "AsyncFunctionsScope"');
	}

	call_AsyncFunctionsScopeCall () {
		let f = async function (a) { return a; };
		let s = AsyncFunctionsScope.init({'key-1': f});
		let r = s.call('key-1', 123);
		Assert.ok(r instanceof Promise, 'Calling instance method "call" of class "AsyncFunctionsScope"');
	}
}

const test = new Test();
console.log(test.run());
