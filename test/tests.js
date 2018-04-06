const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const Scope = require('zscope').Scope;
const AsyncFunction = require('..').AsyncFunction;
const AsyncFunctionScope = require('..').AsyncFunctionScope;

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

		it('_set adds pair (key, value) to AsyncFunctionScope', () => {
			let k1 = { 'key-1': async function () {} };
			let k2 = { 'key-2': async function () {} };
			let k3 = [ 'key-3', async function () {} ];
			let k4 = [ 'key-4', 4 ];
			let s = AsyncFunctionScope.init(k1, k2);
			expect(s._set).to.be.an.instanceof(Function);
			expect(s._set(k3[0], k3[1])).to.false;
			expect(s._get(k3[0])).to.equal(k3[1]);
			expect(s._set(k3[0], k3[1])).to.true;
			expect(s._get(k3[0])).to.equal(k3[1]);
			expect(() => s._set(k4[0], k4[1])).to.throw();
			expect(() => s._get(k4[0])).to.throw();
			expect(s.keys).to.have.members(['key-1', 'key-2', k3[0]]);
		});

		it('apply from AsyncFunctionScope', () => {
			let k1 = { 'key-1': async function () { return 123; } };
			let k2 = { 'key-2': async function () { return 'abc'; } };
			let k3 = { 'key-3': async function (a, b) { return a + b; } };
			let k4 = { 'key-4': async function (a, b, c, d) { return c; } };
			let s = AsyncFunctionScope.init(k1, k2, k3, k4);
			expect(s.apply).to.be.an.instanceof(Function);
			expect(() => s.apply('key-5', [])).to.throw();
			expect(s.apply('key-3', [12, 32])).to.be.an.instanceof(Promise);
			s.apply('key-3', [12, 32]).then((response) => expect(response).to.equal(12 + 32));
		});

		it('call from AsyncFunctionScope', () => {
			let k1 = { 'key-1': async function () { return 123; } };
			let k2 = { 'key-2': async function () { return 'abc'; } };
			let k3 = { 'key-3': async function (a, b) { return a + b; } };
			let k4 = { 'key-4': async function (a, b, c, d) { return c; } };
			let s = AsyncFunctionScope.init(k1, k2, k3, k4);
			expect(s.call).to.be.an.instanceof(Function);
			expect(() => s.call('key-5', [])).to.throw();
			expect(s.call('key-3', 23, 31)).to.be.an.instanceof(Promise);
			s.call('key-3', 23, 31).then((response) => expect(response).to.equal(23 + 31));
		});

	});

});
