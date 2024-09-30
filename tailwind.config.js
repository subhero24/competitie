// const paddingSafePlugin = require('./lib/tailwindcss-padding-safe.js');
// const gridPlacementPlugin = require('tailwindcss-grid-placement');

import paddingSafePlugin from './lib/tailwindcss-padding-safe.js';
import gridPlacementPlugin from 'tailwindcss-grid-placement';

export default {
	content: ['./source/**/*'],
	theme: {
		extend: {
			boxShadow: {
				outer: '0 1px 4px rgba(0, 0, 0, 0.37)',
			},
		},
	},
	plugins: [paddingSafePlugin, gridPlacementPlugin],
};
