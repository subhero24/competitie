const paddingSafePlugin = require('./lib/tailwindcss-padding-safe.cjs');
const gridPlacementPlugin = require('tailwindcss-grid-placement');

module.exports = {
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
