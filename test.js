'use strict';

const sandbox = require('@architect/sandbox'),
	globby = require('globby'),
	Mocha = require('mocha');

(async () => {
	const end = await sandbox.start(),
		tests = await globby([`${__dirname}/test/**/*.js`, `!${__dirname}/**/node_modules`]),
		mocha = new Mocha({
			ui: 'bdd',
			reporter: 'spec',
			inlineDiffs: true
		});
	for (const test of tests) {
		mocha.addFile(test);
	}
	return new Promise(resolve => {
		mocha.run((failures) => {
			end();
			resolve(failures);
		});
	});
})();
