# env-file

[![types](https://img.shields.io/badge/types-included-blue.svg?style=flat-square)]()


Utilities for reading environment variable names & values from files in ".env" format

```text
  env-file
    ✓ Reads key/value pairs
    ✓ Handles commented & empty lines
    ✓ Reads from "./.env" when no path arg supplied
    ✓ Throws on invalid format (missing key or value)
    ✓ Throws on invalid format (space in key or value)
    ✓ Merges the results of multiple input files


  6 passing (9ms)
```

## Installation

```sh
yarn add env-file
# or
npm i env-file
```

## Usage

Typescript-friendly *(type declarations included)*

```text
# path/to/.env
key1=foo
key2=bar
```

```text
# path/.env
key1=foobar
key3=baz
```

```javascript
// path/to/dir/index.js
const { readSingle, readMultiple } = require('env-file');

readSingle('path/to/.env');
// {key1: 'foo', key2: 'bar'}

readMultiple(['path/to/.env', 'path/.env']);
// {key1: 'foobar', key2: 'bar', key3: 'baz'}

readSingle(); // Attempts to read from [cwd]/.env
```

### File Formatting

#### Valid

```text
 key= value

# comment starts with "#"

key = value
key =value

# blank lines ignored
# whitespace trimmed from keys and values

key =    value
```

#### Invalid (throws Error)

```text
# Spaces WITHIN keys or (unquoted) values
key = spaced value

# Absent key, value, or assignment operator
key=
=value
key value

```

## Dependencies

```text
 - None
```

## License

[MIT](LICENSE.md)
