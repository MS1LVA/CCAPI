'use strict';

module.exports = (sample, faker, clamp) => {
	const DEFAULTS = require('./defaults');

	function generateMetaData() {
		const mid = faker.random.alphaNumeric(7),
			url = faker.internet.url(),
			random = faker.random.number(1);
		if (!random) return {};
		return {
			mid: `/m/${mid}`,
			wikipedia_url: url
		};
	}

	function generateMention(word) {
		return {
			text: {
				content: word,
				beginOffset: -1
			},
			type: sample(DEFAULTS.mention.types),
			sentiment: null
		};
	}

	async function analyzeEntities(text) {
		const words = text.split(),
			returner = [];
		for (const word of words) {
			returner.push({
				mentions: [
					generateMention(word)
				],
				metadata: generateMetaData(),
				name: word,
				type: sample(DEFAULTS.entity.types),
				salience: Math.random(),
				sentiment: null
			});
		}
		return returner;
	}

	async function analyzeEntitySentiment(text) {
		const words = text.split(),
			returner = [],
			multiplier = faker.random.number(1) ? 1 : -1,
			magnitude = Math.random();
		for (const word of words) {
			returner.push({
				mentions: [
					generateMention(word)
				],
				metadata: generateMetaData(),
				name: word,
				type: sample(DEFAULTS.entity.types),
				salience: Math.random(),
				sentiment: {
					magnitude,
					score: magnitude * multiplier
				}
			});
		}
		return returner;
	}

	async function analyzeSyntax(text) {
		const words = text.split(),
			returner = [];
		for (const word of words) {
			returner.push({
				text: {
					content: word,
					beginOffset: -1
				},
				partOfSpeech: {
					tag: sample(DEFAULTS.partOfSpeech.tags),
					aspect: sample(DEFAULTS.partOfSpeech.aspects),
					case: sample(DEFAULTS.partOfSpeech.cases),
					form: sample(DEFAULTS.partOfSpeech.forms),
					gender: sample(DEFAULTS.partOfSpeech.genders),
					mood: sample(DEFAULTS.partOfSpeech.moods),
					number: sample(DEFAULTS.partOfSpeech.numbers),
					person: sample(DEFAULTS.partOfSpeech.persons),
					proper: sample(DEFAULTS.partOfSpeech.propers),
					reciprocity: sample(DEFAULTS.partOfSpeech.reciprocities),
					tense: sample(DEFAULTS.partOfSpeech.tenses),
					voice: sample(DEFAULTS.partOfSpeech.voices)
				},
				dependencyEdge: {
					headTokenIndex: faker.random.number(128),
					label: sample(DEFAULTS.dependencyEdge.labels)
				},
				lemma: word
			});
		}
		return returner;
	}

	async function analyzeSentiment(text) {
		const randomNum = Math.random(),
			returner = [
				{
					text: {
						content: text,
						beginOffset: -1
					},
					sentiment: {
						magnitude: randomNum,
						score: randomNum
					}
				}
			];
		return returner;
	}

	async function classifyText() {
		const maxCategories = clamp((Math.random() * 10).toFixed(), 1, 10),
			returner = [];
		for (let i = 0; i < maxCategories; i += 1) {
			returner.push({
				name: faker.random.words(clamp(faker.random.number(8), 1, 8)),
				confidence: Math.random()
			});
		}
		return returner;
	}

	return {
		analyzeEntities,
		analyzeEntitySentiment,
		analyzeSyntax,
		analyzeSentiment,
		classifyText
	};
};
