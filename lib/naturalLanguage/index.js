'use strict';

const path = require('path'),
	GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, '../../config/google-app-credentials.json');

process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS;

async function analyzeSentiment(text) {
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
