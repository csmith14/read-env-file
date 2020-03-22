/* eslint-disable node/no-missing-import */
import {resolve, join} from 'path'
import anyTest, {TestInterface} from 'ava'
import {readMultiple, readSingle} from '../src'

const test = anyTest as TestInterface<{envFiles: any}>

/* test input files directory path */
const inputDir = resolve( __dirname, 'input' )

/* test input files and expected values/error-regex */
test.before( ( t ) => {
	t.context.envFiles = {
		env: {
			value: {
				Key1: 'Value1',
			},
		},
		env1: {
			path:  join( inputDir, '.env1' ),
			value: {
				Key1: 'Value1',
				Key2: 'Value2',
				Key3: '123456',
			},
		},
		env2: {
			path:  join( inputDir, '.env2' ),
			value: {
				KeyA: 'ValueA',
				KeyB: 'ValueB',
				KeyC: '123456',
			},
		},
		env3: {
			path:  join( inputDir, '.env3' ),
			value: {
				Key3: 'Value3',
				KeyC: 'ValueC',
			},
		},
		commented: {
			path:  join( inputDir, '.commented' ),
			value: {Key: 'Value'},
		},
		quoteSpaced: {
			path:  join( inputDir, '.quote-space' ),
			value: {
				double:   'value with spaces',
				single:   'value with spaces',
				backtick: 'value with spaces',
			},
		},
		quotedAssign: {
			path:  join( inputDir, '.multi-assign-quoted' ),
			value: {
				key: 'value = assign',
			},
		},
		keySpaced: {
			path:  join( inputDir, '.key-space' ),
			value: /Invalid file format \(invalid spacing\)/,
		},
		unquotedSpaced: {
			path:  join( inputDir, '.unquoted-space' ),
			value: /Invalid file format \(invalid spacing\)/,
		},
		noKey: {
			path:  join( inputDir, '.invalid1' ),
			value: /Invalid file format \(key undefined\)/,
		},
		noValue: {
			path:  join( inputDir, '.invalid2' ),
			value: /Invalid file format \(value undefined\)/,
		},
		noAssign: {
			path:  join( inputDir, '.invalid3' ),
			value: /Invalid file format \(value undefined\)/,
		},
		multiAssign: {
			path:  join( inputDir, '.multi-assign-invalid' ),
			value: /Invalid file format \(multiple assignment operators\)/,
		},
		invalidLineNumber: {
			path:  join( inputDir, '.invalid-line-number' ),
			value: /\/([a-z0-9-_.]*\/?)*:7/i,
		},
	}
} )

test.serial( 'Reads key/value pairs', async ( t ) => {
	const envObject = await readSingle( t.context.envFiles.env1.path )
	t.deepEqual( envObject, t.context.envFiles.env1.value )
} )

test.serial( 'Reads from "./.env" when no path arg supplied', async ( t ) => {
	process.chdir( inputDir )
	const envObject = await readSingle()
	t.deepEqual( envObject, t.context.envFiles.env.value )
} )

test.serial( 'Handles commented & empty lines', async ( t ) => {
	const envObject = await readSingle( t.context.envFiles.commented.path )
	t.deepEqual( envObject, t.context.envFiles.commented.value )
} )

test.serial( 'Allows spaces in quoted values', async ( t ) => {
	const envObject = await readSingle( t.context.envFiles.quoteSpaced.path )
	t.deepEqual( envObject, t.context.envFiles.quoteSpaced.value )
} )

test.serial( 'Allows assignment operators in quoted values', async ( t ) => {
	const envObject = await readSingle( t.context.envFiles.quotedAssign.path )
	t.deepEqual( envObject, t.context.envFiles.quotedAssign.value )
} )

test.serial( 'Merges the results of multiple input files', async ( t ) => {
	/* read-all paths and t.deepEqualed value */
	const multiple = {
		paths: [
			join( inputDir, '.env1' ),
			join( inputDir, '.env2' ),
			join( inputDir, '.env3' ),
			join( inputDir, '.commented' ),
		],
		value: {
			Key:  'Value',
			Key1: 'Value1',
			Key2: 'Value2',
			Key3: 'Value3',
			KeyA: 'ValueA',
			KeyB: 'ValueB',
			KeyC: 'ValueC',
		},
	}
	const merged = await readMultiple( multiple.paths )
	t.deepEqual( merged, multiple.value )
} )

test.serial( 'Invalid Format (missing key)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.noKey.path ) )
	t.regex( err.message, t.context.envFiles.noKey.value )
} )

test.serial( 'Invalid Format (missing value)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.noValue.path ) )
	t.regex( err.message, t.context.envFiles.noValue.value )
} )

test.serial( 'Invalid Format (missing assignment)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.noAssign.path ) )
	t.regex( err.message, t.context.envFiles.noAssign.value )
} )

test.serial( 'Invalid Format (space in key)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.keySpaced.path ) )
	t.regex( err.message, t.context.envFiles.keySpaced.value )
} )

test.serial( 'Invalid Format (space in unquoted value)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.unquotedSpaced.path ) )
	t.regex( err.message, t.context.envFiles.unquotedSpaced.value )
} )

test.serial( 'Invalid Format (multiple assignment operators)',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.multiAssign.path ) )
	t.regex( err.message, t.context.envFiles.multiAssign.value )
} )

test.serial( 'Invalid Format Error contains accurate line number',  async ( t ) => {
	const err = await t.throwsAsync( () =>  readSingle( t.context.envFiles.invalidLineNumber.path ) )
	t.regex( err.message, t.context.envFiles.invalidLineNumber.value )
} )
