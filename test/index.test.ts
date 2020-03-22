/* eslint-disable node/no-missing-import */
import {resolve, join} from 'path'
import {expect} from 'chai'
import {fancy} from 'fancy-test'
import {readMultiple, readSingle} from '../src'

/* test input files directory path */
const inputDir = resolve( __dirname, 'input' )

/* test input files and expected values */
const envFiles = {
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
	invalid1: {
		path:  join( inputDir, '.invalid1' ),
		value: /Invalid file format:/,
	},
	invalid2: {
		path:  join( inputDir, '.invalid2' ),
		value: /Invalid file format:/,
	},
}

/* read-all paths and expected value */
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
	}}

describe( 'read-file', () => {
	it( 'Reads key/value pairs', () => {
		const envObject = readSingle( envFiles.env1.path )
		expect( envObject ).to.deep.equal( envFiles.env1.value )
	} )

	it( 'Handles commented & empty lines', () => {
		const envObject = readSingle( envFiles.commented.path )
		expect( envObject ).to.deep.equal( envFiles.commented.value )
	} )

	it( 'Reads from "./.env" when no path arg supplied', () => {
		process.chdir( inputDir )
		const envObject = readSingle()
		expect( envObject ).to.deep.equal( envFiles.env1.value )
	} )

	fancy
		.do( () => readSingle( envFiles.invalid1.path ) )
		.catch( envFiles.invalid1.value )
		.it( 'Throws on invalid format (missing key or value)' )

	fancy
		.do( () => readSingle( envFiles.invalid2.path ) )
		.catch( envFiles.invalid2.value )
		.it( 'Throws on invalid format (space in key or value)' )

	it( 'Merges the results of multiple input files', () => {
		const merged = readMultiple( multiple.paths )
		expect( merged ).to.deep.equal( multiple.value )
	} )
} )
