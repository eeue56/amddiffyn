# amddiffyn

Automatically get a typescript definition for a json blob from a url or a file. A good place to start from when dealing with untyped APIs.

Part of the [Hiraeth](https://github.com/eeue56/hiraeth) collection.

## Installation

```
npm install --save @eeue56/amddiffyn
```

## Usage

With a file:

```
npx @eeue56/amddiffyn examples/user.json
```

With a url:

```
npx @eeue56/amddiffyn https://example.com/user.json
```

You can also use it to generate types for [adeilad](https://github.com/eeue56/adeilad) via the `--adeilad` flag:

```
npx @eeue56/amddiffyn --adeilad https://example.com/user.json
```

```
  --adeilad :		If present, generate an adeilad definition
  --stdin :	        Read input from stdin
  -h, --help :		This help text
Provide either a url starting with http/https, or a file path
```

## Name

Amddiffyn means defend. An English speaker may pronounce it as "am-ffith-in".
