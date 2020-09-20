'use strict';

const sandbox = require('@architect/sandbox'),
	globby = require('globby'),
	path = require('path'),
	Mocha = require('mocha'),
	deepmerge = require('deepmerge'),
	get = require('lodash.get'),
	configEnv = process.env.NODE_ENV || 'local',
	config = require('./src/shared/config')(deepmerge, get, configEnv),
	argv = require('minimist')(process.argv.slice(2)),
	testPath = argv.path ? path.resolve(__dirname, argv.path) : __dirname,
	BASE = {
		...config.get('api.base')
	};

console.log(`TEST PATH: ${testPath}`);

async function testSuite() {
	// Set a global base URL for testing.
	global.BASE = `${BASE.protocol}://${BASE.host}:${BASE.port}`;
	const end = await sandbox.start(),
		tests = argv.path ? await globby([`${testPath}/**/*.js`, '!**/**/node_modules']) : await globby([`${testPath}/test/**/*.js`, `!${__dirname}/**/node_modules`, `${testPath}/**/test/*.js`, '!**/**/node_modules']),
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
