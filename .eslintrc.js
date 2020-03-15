module.exports = {
	'env': {
		'commonjs': true,
		'es6': true,
		'node': true,
		'mocha': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'ignorePatterns': [
		'node_modules/',
		'docs/out/'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'brace-style': [
			'error',
			'1tbs'
		],
		'eol-last': [
			'error',
			'always'
		],
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': [
			'error',
			{
				'max': 2,
				'maxEOF': 1
			}
		],
		'one-var': [
			'error',
			'consecutive'
		],
		'one-var-declaration-per-line': [
			'error',
			'always'
		],
		'no-extend-native': [
			'error'
		],
		'object-curly-spacing': [
			'error',
			'always'
		],
		'object-curly-newline': [
			'error',
			{
				'ObjectPattern': { 'multiline': true },
				'ImportDeclaration': 'never',
				'ExportDeclaration': { 'multiline': true, 'minProperties': 3 },
				'ObjectExpression': 'always'
			}
		],
		'object-property-newline': [
			'error'
		],
		'padded-blocks': [
			'error',
			'never'
		]
	}
};