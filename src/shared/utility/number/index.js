'use strict';

/**
 * @description Restrict a number to a min and max.
 */
function clamp(number, min, max) {
	return Math.min(Math.max(number, min), max);
}

module.exports = {
	clamp
};
