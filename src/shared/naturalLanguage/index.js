'use strict';

/**
 * @file Handles all calls to the Google NLAPI or mock functions.
 * @module shared/naturalLanguage
 */

module.exports = (config, clamp) => {
	// Consts
	const ENABLED = config.get('api.naturalLanguage.enabled', false),
		MOCKS_ENABLED = config.get('api.naturalLanguage.mock', false);

	if (!ENABLED)
		return {
			analyzeEntities: () => {
				return;
			},
			analyzeEntitySentiment: () => {
				return;
			},
			analyzeSyntax: () => {
				return;
			},
			analyzeSentiment: () => {
				return;
			},
			classifyText: () => {
				return;
			}
		};

	if (MOCKS_ENABLED) {
		const sample = require('lodash.sample'),
			faker = require('faker'),
			mock = require('./mock')(sample, faker, clamp);
		return mock;
	}

	const language = require('@google-cloud/language'),
		path = require('path'),
		// Consts
		GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, '.', 'google-app-credentials.json');

	process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS;
	async function analyzeSentiment(text) {
		if (!ENABLED) return;
		const client = new language.LanguageServiceClient(),
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
		const client = new language.LanguageServiceClient(),
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
		const client = new language.LanguageServiceClient(),
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
		const client = new language.LanguageServiceClient(),
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
		const client = new language.LanguageServiceClient(),
			document = {
				content: text,
				type: 'PLAIN_TEXT',
			},
			[classification] = await client.classifyText({
				document
			});

		return classification.categories;
	}

	return {
		analyzeEntities,
		analyzeEntitySentiment,
		analyzeSyntax,
		analyzeSentiment,
		classifyText
	};
};

