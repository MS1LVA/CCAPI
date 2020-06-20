'use strict';

const sandbox = require('@architect/sandbox'),
	globby = require('globby'),
	path = require('path'),
	Mocha = require('mocha'),
	argv = require('minimist')(process.argv.slice(2)),
	testPath = argv.path || argv.p;

console.log(process.argv, argv, testPath);

async function testSuite() {
	// Set a global base URL for testing.
	global.BASE = 'http://localhost:3333';
	const end = await sandbox.start(),
		pathRoot = testPath ? path.resolve(__dirname, testPath) : __dirname,
		tests = await globby([`${pathRoot}/test/**/*.js`, `!${__dirname}/**/node_modules`, `${pathRoot}/lib/**/test/*.js`]),
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
