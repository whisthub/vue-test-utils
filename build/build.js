// # build.js
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);

// Find the exports using a regex.
const file = require.resolve('@vue/test-utils');
const contents = fs.readFileSync(file).toString('utf8');
const lines = contents.trim().split('\n').map(line => line.trim()).reverse();
const exports = [];
let match;
while ((match = /exports\.([a-zA-Z0-9]+) = /g.exec(lines.shift()))) {
	let [, id] = match;
	exports.push(id);
}

// Wrap the commonjs stuff in something that can be used with esm.
const src = `
import Vue from 'vue';
import vueTemplateCompiler from 'vue-template-compiler';

function require(id) {
	return ({
		vue: Vue,
		'vue-template-compiler': vueTemplateCompiler,
		'@vue/test-utils': { config: {} },
	})[id];
}
const module = {
	exports: {},
};

(function(require, module, exports) {
${contents}
})(require, module, module.exports);

export const {${exports.join(',')}} = module.exports;
`;

// Write away.
const dist = path.join(process.cwd(), 'dist');
if (!fs.existsSync(dist)) {
	fs.mkdirSync(dist);
}
const outputPath = path.join(dist, 'vue-test-utils.js');
fs.writeFileSync(outputPath, src);
