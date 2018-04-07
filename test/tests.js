const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const mlog = require('mocha-logger');
const util = require('util');
const Scope = require('zscope').Scope;
const AsyncFunction = require('../AsyncFunction').AsyncFunction;
const AsyncFunctionScope = require('../AsyncFunctionScope').AsyncFunctionScope;

describe('AsyncFunction', () => {
	it('is async function class', () => {
		expect(async function () {}).to.be.instanceof(AsyncFunction);
	});

});

describe('AsyncFunctionScope', () => {
	describe('static', () => {
		it('AsyncFunctionScope is a function', () => {
			expect(AsyncFunctionScope).to.be.instanceof(Function);
		});

	});

	describe('instance', () => {
		it('AsyncFunctionScope creats instanceof AsyncFunctionScope', () => {
			expect(new AsyncFunctionScope()).to.be.an.instanceof(AsyncFunctionScope);
		});

		it('AsyncFunctionScope creats instanceof Scope', () => {
			expect(new AsyncFunctionScope()).to.be.an.instanceof(Scope);
		});

		it('AsyncFunctionScope.init creats instanceof AsyncFunctionScope', () => {
			expect(AsyncFunctionScope.init()).to.be.an.instanceof(AsyncFunctionScope);
		});

		it('AsyncFunctionScope.init creats instanceof AsyncFunctionScope with arguments', () => {
			let k1 = { 'key-1': async function () {} };
			let k2 = { 'key-2': async function () {} };
			expect(AsyncFunctionScope.init(k1, k2)).to.be.an.instanceof(AsyncFunctionScope);
		});

		{
			let k1 = { 'key-1': async function () {} };
			let k2 = { 'key-2': async function () {} };
			let k3 = { 'key-3': async function () {} };
			let k4 = { 'key-4': 4 };
			let s = AsyncFunctionScope.init(k1, k2);

			it('AsyncFunctionScope._set is a function', () => {
				expect(s._set).to.be.an.instanceof(Function);
			});

			it('AsyncFunctionScope._set adds pair (key-3, async) to AsyncFunctionScope', () => {
				expect(s._set(k3)).to.false;
				expect(s._get('key-3')).to.equal(k3['key-3']);
			});

			it('AsyncFunctionScope._set overwrite pair (key-3, async) of AsyncFunctionScope', () => {
				expect(s._set(k3)).to.true;
				expect(s._get('key-3')).to.equal(k3['key-3']);
			});

			it('AsyncFunctionScope._set adds pair (key-4, non-async) to AsyncFunctionScope', () => {
				expect(() => s._set(k4[0], k4[1])).to.throw();
				expect(() => s._get(k4[0])).to.throw();
			});

			it('AsyncFunctionScope._set have added key-3 to AsyncFunctionScope', () => {
				expect(s.keys).to.have.members(['key-1', 'key-2', 'key-3']);
			});
		}

		{
			let k1 = { 'key-1': async function () { return 123; } };
			let k2 = { 'key-2': async function () { return 'abc'; } };
			let k3 = { 'key-3': async function (a, b) { return a + b; } };
			let k4 = { 'key-4': async function (a, b, c, d) { return c; } };

			{
				let s = AsyncFunctionScope.init(k1, k2, k3, k4);

				it('AsyncFunctionScope.apply is a function', () => {
					expect(s.apply).to.be.an.instanceof(Function);
				});

				it('AsyncFunctionScope.apply with unknown key-5', () => {
					expect(() => s.apply('key-5', [])).to.throw();
				});

				it('AsyncFunctionScope.apply with key-3 return Promise', () => {
					expect(s.apply('key-3', [12, 32])).to.be.an.instanceof(Promise);
				});

				it('AsyncFunctionScope.apply with key-1 without arguments', (done) => {
					s.apply('key-1').should.eventually.equal(123).notify(done);	
				});

				it('AsyncFunctionScope.apply with key-1 with []', (done) => {
					s.apply('key-1', []).should.eventually.equal(123).notify(done);
				});

				it('AsyncFunctionScope.apply with key-2', (done) => {
					s.apply('key-2').should.eventually.equal('abc').notify(done);
				});

				it('AsyncFunctionScope.apply with key-3 with [12, 32]', (done) => {
					s.apply('key-3', [12, 32]).should.eventually.equal(12 + 32).notify(done);
				});

				it('AsyncFunctionScope.apply with key-4 with [11, 22, 33, 44]', (done) => {
					s.apply('key-4', [11, 22, 33, 44]).should.eventually.equal(33).notify(done);
				});
			}

			{
				let s = AsyncFunctionScope.init(k1, k2, k3, k4);

				it('AsyncFunctionScope.call is a function', () => {
					expect(s.call).to.be.an.instanceof(Function);
				});

				it('AsyncFunctionScope.call with unknown key-5', () => {
					expect(() => s.call('key-5', [])).to.throw();
				});

				it('AsyncFunctionScope.call with key-3 return Promise', () => {
					expect(s.call('key-3', 23, 31)).to.be.an.instanceof(Promise);
				});

				it('AsyncFunctionScope.call with key-3 with (23, 31)', (done) => {
					s.call('key-3', 23, 31).should.eventually.equal(23 + 31).notify(done);
				});

				it('AsyncFunctionScope.call with key-3 with (23, 32)', (done) => {
					s.call('key-3', 23, 32).should.eventually.not.equal(23 + 3).notify(done);
				});
			}

		}

	});

});
