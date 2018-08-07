(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global._promise = factory());
}(this, (function () { 'use strict';

	class Promise {}

	return Promise;

})));
