# read-env-file

[![types](https://img.shields.io/badge/types-included-blue.svg?style=flat-square)]()


Utilities for reading environment variable names & values from files in ".env" format

```text
  ✔ Reads key/value pairs
  ✔ Handles commented & empty lines
  ✔ Allows spaces in quoted values
  ✔ Allows assignment operators in quoted values
  ✔ Reads from "./.env" when no path arg supplied
  ✔ Merges the results of multiple input files

  ✔ Invalid Format (missing key)
  ✔ Invalid Format (missing value)
  ✔ Invalid Format (missing assignment)
  ✔ Invalid Format (space in key)
  ✔ Invalid Format (space in unquoted value)
  ✔ Invalid Format (multiple assignment operators)
  ✔ Invalid Format Error contains accurate line number
```

## Installation

```sh
yarn add read-env-file
# or
npm i read-env-file
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
const { readSingle, readMultiple } = require('read-env-file');

readSingle('path/to/.env');
// {key1: 'foo', key2: 'bar'}

readMultiple(['path/to/.env', 'path/.env']);
// {key1: 'foobar', key2: 'bar', key3: 'baz'}

readSingle();
// Attempts to read from ./.env
```

## File Formatting

### Valid

- comments and blank lines are ignored
- values quoted (with `'`,  `"`, or backtick) to include spaces and `=` character
- spaces around keys and values are ignored

```text
key=value
# comment starts with "#" (ignored)

# whitespace is trimmed from keys and values
key = value
key =value
key= value

# whitespace in quoted values preserved
key="value with spaces'

# Assignment operators in quoted values preserved
key="value=abc"

```

### Invalid (throws Error)

Errors are informative and specify the cause, file, and line number:

```sh
Invalid file format (multiple assignment operators) at /some/path/.env:12
```

The following conditions cause an invalid format error:

| Cause                         | Error Mssage                    |
| ----------------------------- | ------------------------------- |
| missing key                   | `key undefined`                 |
| missing value                 | `value undefined`               |
| missing assignment            | `value undefined`               |
| space in key                  | `invalid spacing`               |
| space in unquoted value       | `invalid spacing`               |
| multiple assignment operators | `multiple assignment operators` |

```text
# missing key
=value

# missing value
key=

# missing assignment
keyvalue

# space in key
k e y = value

# space in unquoted value
key=value and words

# multiple assignment operators
key=value=invalid
```

## Dependencies

None

## License

[MIT](LICENSE.md)
