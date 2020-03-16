'use strict';

const path = require('path'),
	resolved = path.resolve(__dirname, '../../config/google-app-credentials.json');
console.log(resolved);

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, '../../config/google-app-credentials.json');

async function analyzeSentiment(text) {
	// [START language_sentiment_text]
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient(),

		/**
   * TODO(developer): Uncomment the following line to run this code.
   */
		// const text = 'Your text to analyze, e.g. Hello, world!';

		// Prepares a document, representing the provided text
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},

		// Detects the sentiment of the document
		[result] = await client.analyzeSentiment({
			document
		});

	return result.sentences;
}

async function analyzeEntities(text) {
	// [START language_entities_text]
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient(),

		/**
   * TODO(developer): Uncomment the following line to run this code.
   */
		// const text = 'Your text to analyze, e.g. Hello, world!';

		// Prepares a document, representing the provided text
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},

		// Detects entities in the document
		[result] = await client.analyzeEntities({
			document
		});

	return result.entities;
}

async function analyzeSyntax(text) {
	// [START language_syntax_text]
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient(),

		/**
   * TODO(developer): Uncomment the following line to run this code.
   */
		// const text = 'Your text to analyze, e.g. Hello, world!';

		// Prepares a document, representing the provided text
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},

		// Detects syntax in the document
		[syntax] = await client.analyzeSyntax({
			document
		});

	return syntax.tokens;
}

async function analyzeEntitySentiment(text) {
	// [START language_entity_sentiment_text]
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient(),

		/**
   * TODO(developer): Uncomment the following line to run this code.
   */
		// const text = 'Your text to analyze, e.g. Hello, world!';

		// Prepares a document, representing the provided text
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},

		// Detects sentiment of entities in the document
		[result] = await client.analyzeEntitySentiment({
			document
		});
	return result.entities;
}

async function classifyText(text) {
	// [START language_classify_text]
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient(),

		/**
   * TODO(developer): Uncomment the following line to run this code.
   */
		// const text = 'Your text to analyze, e.g. Hello, world!';

		// Prepares a document, representing the provided text
		document = {
			content: text,
			type: 'PLAIN_TEXT',
		},

		// Classifies text in the document
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
