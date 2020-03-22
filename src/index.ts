import {readFileSync} from 'fs'
import {isAbsolute, resolve} from 'path'

interface EnvVars {
  [key: string]: string;
}

function mapToObject( map: Map<string, string> ) {
	const arr = [ ...map.entries() ]
	return arr.reduce( ( carrier: any, entry ) => {
		const [ k, v ] = entry
		carrier[k] = v
		return carrier
	}, {} )
}

function mapVarsFromLines( lines: string[] ) {
	const map = new Map()
	lines
		.filter( ( v ) => v.trim().length && v[0] !== '#' ) // Remove blank & commented
		.forEach( ( line, index ) => {
			const [ key, value ] = line.split( '=' ).map( ( s ) => s.trim() )
			/* No key, No value, Key OR Value contain a space */
			if ( !key || !value || [ key, value ].some( ( i ) => /\s/.test( i ) ) ) {
				throw new Error( `FORMAT:${index + 1}` )
			}
			map.set( key, value )
		} )
	return map
}

/**
 * Given a path to a file in .env format, returns key/value pairs in an object.
 * @param {string?} path The file path to read. If omitted, attempts to read from `./.env`
 * @returns {object} An object of corresponding key/value pairs
 * @throws Error if file is not in valid format, or file is not found
 */
export function readSingle( path?: string ): EnvVars {
	path = path || resolve( process.cwd(), '.env' )
	const file = isAbsolute( path ) ? path : resolve( process.cwd(), path )
	const content = readFileSync( file, 'utf8' )
	const lines = content.split( '\n' )
	try {
		const map = mapVarsFromLines( lines )
		return mapToObject( map )
	} catch ( error ) {
		const message = error.message || ''
		if ( message.includes( 'FORMAT' ) ) {
			throw new Error( `Invalid file format: ${path}:${parseInt( message.split( ':' )[1], 10 )}` )
		}
		throw error
	}
}

/**
 * @description Given an array of paths, will read each and add the key/value
 * pairs to an object which is returned at the end. Any re-used keys will be overwritten by
 * the most recent value.
 * @param {string[]} paths An array of file paths to read.
 * @returns {object} An aggregate object of key/value pairs
 * @throws Error if any file is not in valid format or not found
 */
export function readMultiple( paths: string[] ): EnvVars {
	return paths.reduce( ( carrier: any, path ) => {
		const obj = readSingle( path )
		return {
			...carrier,
			...obj,
		}
	}, {} )
}
