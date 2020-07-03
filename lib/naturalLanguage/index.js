'use strict';

const path = require('path'),
	config = require('../config'),
	mock = require('./mock'),
	ENABLED = config.get('api.naturalLanguage.enabled', false),
	MOCKS_ENABLED = config.get('api.naturalLanguage.mock', false),
	GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, '../../config/google-app-credentials.json');

process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS;

async function analyzeSentiment(text) {
	if (!ENABLED) return;
	const language = require('@google-cloud/language'),
		client = new language.LanguageServiceClient(),
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},
		[result] = await client.analyzeSentiment({
			document
		});

	return result.sentences;
}

async function analyzeEntities(text) {
	if (!ENABLED) return;
	const language = require('@google-cloud/language'),
		client = new language.LanguageServiceClient(),
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},
		[result] = await client.analyzeEntities({
			document
		});

	return result.entities;
}

async function analyzeSyntax(text) {
	if (!ENABLED) return;
	const language = require('@google-cloud/language'),
		client = new language.LanguageServiceClient(),
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},
		[syntax] = await client.analyzeSyntax({
			document
		});

	return syntax.tokens;
}

async function analyzeEntitySentiment(text) {
	if (!ENABLED) return;
	const language = require('@google-cloud/language'),
		client = new language.LanguageServiceClient(),
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},
		[result] = await client.analyzeEntitySentiment({
			document
		});
	return result.entities;
}

async function classifyText(text) {
	if (!ENABLED) return;
	const language = require('@google-cloud/language'),
		client = new language.LanguageServiceClient(),
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},
		[classification] = await client.classifyText({
			document
		});

	return classification.categories;
}

module.exports = {
	analyzeEntities,
	analyzeEntitySentiment,
	analyzeSyntax,
	analyzeSentiment,
	classifyText
};

if (MOCKS_ENABLED) module.exports = mock;
