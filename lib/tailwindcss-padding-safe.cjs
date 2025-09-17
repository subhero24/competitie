const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities, e, config }) {
	const paddings = config('theme.paddingSafe.padding', config('theme.padding', {}));
	const variants = config('variants.paddingSafe', config('variants.padding', {}));
	const suffix = config('theme.paddingSafe.suffix', 'safe');

	function generate(size, modifier) {
		return [
			{ [`.${e(`p-${modifier}-${suffix}`)}`]: { padding: `${size}` } },
			{
				[`.${e(`py-${modifier}-${suffix}`)}`]: {
					'padding-top': `${size}`,
					'padding-bottom': `${size}`,
				},
			},
			{
				[`.${e(`px-${modifier}-${suffix}`)}`]: {
					'padding-left': `${size}`,
					'padding-right': `${size}`,
				},
			},
			{ [`.${e(`pt-${modifier}-${suffix}`)}`]: { 'padding-top': `${size}` } },
			{ [`.${e(`pr-${modifier}-${suffix}`)}`]: { 'padding-right': `${size}` } },
			{ [`.${e(`pb-${modifier}-${suffix}`)}`]: { 'padding-bottom': `${size}` } },
			{ [`.${e(`pl-${modifier}-${suffix}`)}`]: { 'padding-left': `${size}` } },
			{
				'@supports(padding: max(0px))': {
					[`.${e(`p-${modifier}-${suffix}`)}`]: {
						'padding-top': `max(${size}, env(safe-area-inset-top))`,
						'padding-bottom': `max(${size}, env(safe-area-inset-bottom))`,
						'padding-left': `max(${size}, env(safe-area-inset-left))`,
						'padding-right': `max(${size}, env(safe-area-inset-right))`,
					},
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`py-${modifier}-${suffix}`)}`]: {
						'padding-top': `max(${size}, env(safe-area-inset-top))`,
						'padding-bottom': `max(${size}, env(safe-area-inset-bottom))`,
					},
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`px-${modifier}-${suffix}`)}`]: {
						'padding-left': `max(${size}, env(safe-area-inset-left))`,
						'padding-right': `max(${size}, env(safe-area-inset-right))`,
					},
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`pt-${modifier}-${suffix}`)}`]: { 'padding-top': `max(${size}, env(safe-area-inset-top))` },
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`pr-${modifier}-${suffix}`)}`]: {
						'padding-right': `max(${size}, env(safe-area-inset-right))`,
					},
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`pb-${modifier}-${suffix}`)}`]: {
						'padding-bottom': `max(${size}, env(safe-area-inset-bottom))`,
					},
				},
			},
			{
				'@supports(padding: max(0px))': {
					[`.${e(`pl-${modifier}-${suffix}`)}`]: {
						'padding-left': `max(${size}, env(safe-area-inset-left))`,
					},
				},
			},
		];
	}

	for (let modifier in paddings) {
		let size = paddings[modifier];
		let utilities = generate(size, modifier);

		addUtilities(utilities, variants);
	}
});
