'use strict';

const sandbox = require('@architect/sandbox'),
	globby = require('globby'),
	Mocha = require('mocha');

async function testSuite() {
	// Set a global base URL for testing.
	global.BASE = 'http://localhost:3333';
	const end = await sandbox.start(),
		tests = await globby([`${__dirname}/test/**/*.js`, `!${__dirname}/**/node_modules`, `${__dirname}/lib/**/test/*.js`]),
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
}

testSuite().then(failures => {
	console.log(`${failures} failing tests`);
	process.exit(0);
});
