#!/usr/bin/env ts-node

import {
    bothFlag,
    empty,
    help,
    longFlag,
    number,
    parse,
    parser,
} from "@eeue56/baner";
import { readFile } from "fs/promises";
import fetch from "node-fetch";

export type JsonString = {
    kind: "string";
    value: string;
};

export function JsonString(value: string): JsonString {
    return {
        kind: "string",
        value: value,
    };
}

export type JsonNumber = {
    kind: "number";
    value: number;
};

export function JsonNumber(value: number): JsonNumber {
    return {
        kind: "number",
        value: value,
    };
}

export type JsonBoolean = {
    kind: "boolean";
    value: boolean;
};

export function JsonBoolean(value: boolean): JsonBoolean {
    return {
        kind: "boolean",
        value: value,
    };
}

export type JsonNull = {
    kind: "null";
};

export function JsonNull(): JsonNull {
    return {
        kind: "null",
    };
}

export type JsonList = {
    kind: "list";
    values: Json[];
};

export function JsonList(values: Json[]): JsonList {
    return {
        kind: "list",
        values: values,
    };
}

export type JsonObject = {
    kind: "object";
    pairs: Record<string, Json>;
};

export function JsonObject(pairs: Record<string, Json>): JsonObject {
    return {
        kind: "object",
        pairs: pairs,
    };
}

export type Json =
    | JsonString
    | JsonNumber
    | JsonBoolean
    | JsonNull
    | JsonObject
    | JsonList;

export function typeTreeDiff(first: Json, second: Json): string {
    if (first.kind !== second.kind)
        return `Mismatching kind: ${first.kind} !== ${second.kind}`;

    switch (first.kind) {
        case "string": {
            return "";
        }
        case "number": {
            return "";
        }
        case "boolean": {
            return "";
        }
        case "null": {
            return "";
        }
        case "list": {
            second = second as JsonList;

            const firstValuesTypes = reduceTypes(first.values);
            const secondValueTypes = reduceTypes(second.values);

            if (firstValuesTypes.length !== secondValueTypes.length)
                return "Different length of types in list";

            const innerValues = firstValuesTypes.map((value, index) => {
                return typeTreeDiff(value, secondValueTypes[index]);
            });

            return innerValues.filter((x) => x).join("\n");
        }
        case "object": {
            second = second as JsonObject;

            if (
                Object.keys(first.pairs).length !==
                Object.keys(second.pairs).length
            ) {
                return "Mismatching pairs length";
            }

            const secondKeys = Object.keys(second.pairs);

            const innerValues = Object.keys(first.pairs).map((key) => {
                if (secondKeys.indexOf(key) === -1) return "";
                return typeTreeDiff(
                    first.pairs[key],
                    (second as JsonObject).pairs[key]
                );
            });

            return innerValues.filter((x) => x).join("\n");
        }
    }
}

export function typeTreeIsEqual(first: Json, second: Json): boolean {
    if (first.kind !== second.kind) return false;

    switch (first.kind) {
        case "string": {
            return true;
        }
        case "number": {
            return true;
        }
        case "boolean": {
            return true;
        }
        case "null": {
            return true;
        }
        case "list": {
            second = second as JsonList;

            const firstValuesTypes = reduceTypes(first.values);
            const secondValueTypes = reduceTypes(second.values);

            if (firstValuesTypes.length !== secondValueTypes.length)
                return false;

            const innerValues = firstValuesTypes.map((value, index) => {
                return typeTreeIsEqual(value, secondValueTypes[index]);
            });

            return innerValues.filter((x) => !x).length === 0;
        }
        case "object": {
            second = second as JsonObject;

            if (
                Object.keys(first.pairs).length !==
                Object.keys(second.pairs).length
            ) {
                return false;
            }

            const secondKeys = Object.keys(second.pairs);

            const innerValues = Object.keys(first.pairs).map((key) => {
                if (secondKeys.indexOf(key) === -1) return false;
                return typeTreeIsEqual(
                    first.pairs[key],
                    (second as JsonObject).pairs[key]
                );
            });

            return innerValues.filter((x) => !x).length === 0;
        }
    }
}

/**
 *
 * @param json parsed json
 * @returns a representation of the type tree as a string
 */
export function typeTreeToString(json: Json): string {
    switch (json.kind) {
        case "string": {
            return "string";
        }
        case "number": {
            return "number";
        }
        case "boolean": {
            return "boolean";
        }
        case "null": {
            return "null";
        }
        case "list": {
            if (json.values.length === 0) return "list [ ]";
            const innerValues = json.values.map(typeTreeToString).join(", ");
            return `list [ ${innerValues} ]`;
        }
        case "object": {
            if (Object.keys(json.pairs).length === 0) return "object { }";

            return (
                "object { " +
                Object.entries(json.pairs)
                    .map(([ key, value ]) => {
                        return key + ": " + typeTreeToString(value);
                    })
                    .join(", ") +
                " }"
            );
        }
    }
}

export function reduceTypes(types: Json[]): Json[] {
    return types.reduce((previousValue: Json[], currentValue: Json): Json[] => {
        if (
            previousValue
                .map((prev) => typeTreeIsEqual(prev, currentValue))
                .filter((x) => x).length === 0
        ) {
            previousValue.push(currentValue);
        }

        return previousValue;
    }, [ ]);
}

export function generalizeTypes(json: Json): Json {
    switch (json.kind) {
        // already as generalized as possible
        case "string":
        case "number":
        case "boolean":
        case "null":
            return json;

        // we need to diff items in the list to get the general idea
        case "list": {
            if (json.values.length === 0) return json;
            const innerValues = reduceTypes(json.values);
            if (innerValues.length === 1) return JsonList(innerValues);
            return json;
        }
        case "object": {
            if (Object.keys(json.pairs).length === 0) return json;

            const returnObject: Record<string, Json> = {};

            Object.entries(json.pairs).forEach(([ key, value ]) => {
                returnObject[key] = generalizeTypes(value);
            });

            return JsonObject(returnObject);
        }
    }
}

function containsInvalidChar(key: string): boolean {
    return (
        [ "@", "<", ">", " ", ".", ",", "!" ].filter(
            (char) => key.indexOf(char) > -1
        ).length > 0
    );
}

export function typeTreeToTypescript(json: Json): string {
    switch (json.kind) {
        case "string": {
            return "string";
        }
        case "number": {
            return "number";
        }
        case "boolean": {
            return "boolean";
        }
        case "null": {
            return "null";
        }
        case "list": {
            if (json.values.length === 0) return "any[]";
            const innerValues = reduceTypes(json.values)
                .map(typeTreeToTypescript)
                .join(" | ");
            return `(${innerValues})[]`;
        }
        case "object": {
            if (Object.keys(json.pairs).length === 0) return "{ }";

            return (
                "{ " +
                Object.entries(json.pairs)
                    .map(([ rawKey, value ]) => {
                        const key = containsInvalidChar(rawKey)
                            ? `"${rawKey}"`
                            : rawKey;
                        return key + ": " + typeTreeToTypescript(value);
                    })
                    .join(", ") +
                " }"
            );
        }
    }
}

export function typeTreeToAdeilad(json: Json): string {
    switch (json.kind) {
        case "string": {
            return "string()";
        }
        case "number": {
            return "number()";
        }
        case "boolean": {
            return "bool()";
        }
        case "null": {
            return "null()";
        }
        case "list": {
            if (json.values.length === 0) return "array(any())";
            const innerValues = reduceTypes(json.values).map(typeTreeToAdeilad);

            if (innerValues.length > 0) {
                return `array(oneOf([${innerValues.join(", ")}]))`;
            }
            return `array(${innerValues[0]})`;
        }
        case "object": {
            if (Object.keys(json.pairs).length === 0) return "record()";

            return (
                "pipeline([" +
                Object.entries(json.pairs)
                    .map(([ key, value ]) => {
                        return `required("${key}", ${typeTreeToAdeilad(
                            value
                        )})`;
                    })
                    .join(", ") +
                "], SomeObject)"
            );
        }
    }
}

export function jsonBlobToJsonTypeTree(json: any): Json {
    if (typeof json === "boolean") {
        return JsonBoolean(json as boolean);
    } else if (typeof json === "number") {
        return JsonNumber(json as number);
    } else if (typeof json === "string") {
        return JsonString(json as string);
    } else if (Array.isArray(json)) {
        return JsonList(json.map(jsonBlobToJsonTypeTree));
    } else if (json === null) {
        return JsonNull();
    } else {
        const entries = Object.entries(json);

        const entryToJson = ([ key, value ]: [string, any]) => {
            return [ key, jsonBlobToJsonTypeTree(value) ];
        };

        return JsonObject(Object.fromEntries(entries.map(entryToJson)));
    }
}

export async function runner(): Promise<any> {
    const flagParser = parser([
        longFlag(
            "adeilad",
            "If present, generate an adeilad definition",
            empty()
        ),
        bothFlag("h", "help", "This help text", empty()),
    ]);
    const program = parse(flagParser, process.argv);

    if (program.flags["h/help"].isPresent) {
        console.log(help(flagParser));
        console.log(
            "Provide either a url starting with http/https, or a file path"
        );
        return;
    }

    const fileOrUrl = program.args[program.args.length - 1];

    let asJson: any;

    if (fileOrUrl.startsWith("http")) {
        const response = await fetch(fileOrUrl);
        asJson = await response.json();
    } else {
        const fileContents = (await readFile(fileOrUrl)).toString("utf-8");
        asJson = JSON.parse(fileContents);
    }

    const asParsedJson = jsonBlobToJsonTypeTree(asJson);

    if (program.flags.adeilad.isPresent) {
        console.log(typeTreeToAdeilad(asParsedJson));
    } else {
        console.log(typeTreeToTypescript(asParsedJson));
    }
}

if (require.main === module) {
    runner();
}
