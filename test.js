'use strict';

const sandbox = require('@architect/sandbox'),
	globby = require('globby'),
	Mocha = require('mocha');

(async () => {
	// Set a global base URL for testing.
	global.BASE = 'http://localhost:3333';
	const end = await sandbox.start(),
		tests = await globby([`${__dirname}/test/**/*.js`, `!${__dirname}/**/node_modules`]),
		mocha = new Mocha({
			ui: 'bdd',
			reporter: 'spec',
			inlineDiffs: true,
			globals: ['BASE']
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
