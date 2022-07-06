import './setup.js';
import assert from 'node:assert';
import { mount } from '@whisthub/vue-test-utils';
import Vue from 'vue';
import { createRequire } from 'node:module';

describe('The vue test utils', function () {

	before(function() {
		Vue.prototype.foo = 'bar';
	});

	it('loads Vue as esm', function() {
		let view = mount({
			render: () => null
		});
		assert.equal(view.vm.foo, 'bar');
	});

	after(function() {
		delete Vue.prototype.foo;
	});

});
