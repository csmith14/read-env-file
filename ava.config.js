const config = {
	files: [
		'test/**/*',
		'!test/input/**/*',
	],

	extensions: [
		'ts',
	],

	verbose:  true,
	failFast: true,
	// compileEnhancements: false,

	require: [
		'ts-node/register',
	],
}

/* export default config */

export default config
