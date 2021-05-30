import { readFile } from "fs/promises";
import fetch from "node-fetch";

type JsonString = {
    kind: "string";
    value: string;
};

function JsonString(value: string): JsonString {
    return {
        kind: "string",
        value: value,
    };
}

type JsonNumber = {
    kind: "number";
    value: number;
};

function JsonNumber(value: number): JsonNumber {
    return {
        kind: "number",
        value: value,
    };
}

type JsonBoolean = {
    kind: "boolean";
    value: boolean;
};

function JsonBoolean(value: boolean): JsonBoolean {
    return {
        kind: "boolean",
        value: value,
    };
}

type JsonNull = {
    kind: "null";
};

function JsonNull(): JsonNull {
    return {
        kind: "null",
    };
}

type JsonList = {
    kind: "list";
    values: Json[];
};

function JsonList(values: Json[]): JsonList {
    return {
        kind: "list",
        values: values,
    };
}

type JsonObject = {
    kind: "object";
    pairs: Record<string, Json>;
};

function JsonObject(pairs: Record<string, Json>): JsonObject {
    return {
        kind: "object",
        pairs: pairs,
    };
}

type Json =
    | JsonString
    | JsonNumber
    | JsonBoolean
    | JsonNull
    | JsonObject
    | JsonList;

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

            if (first.values.length !== second.values.length) return false;

            const innerValues = first.values.map((value, index) => {
                return typeTreeIsEqual(
                    value,
                    (second as JsonList).values[index]
                );
            });

            return innerValues.filter((x) => x).length === 0;
        }
        case "object": {
            second = second as JsonObject;
            if (
                Object.keys(first.pairs).length !==
                Object.keys(second.pairs).length
            )
                return false;
            if (Object.keys(first.pairs) !== Object.keys(second.pairs))
                return false;

            const innerValues = Object.keys(first.pairs).map((key) => {
                return typeTreeIsEqual(
                    first.pairs[key],
                    (second as JsonObject).pairs[key]
                );
            });

            return innerValues.filter((x) => x).length === 0;
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

function reduceTypes(types: Json[]): Json[] {
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
                    .map(([ key, value ]) => {
                        return key + ": " + typeTreeToTypescript(value);
                    })
                    .join(", ") +
                " }"
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
    const fileOrUrl = process.argv[process.argv.length - 1];

    if (fileOrUrl.startsWith("http")) {
        const response = await fetch(fileOrUrl);
        const asJson = await response.json();
        const asParsedJson = jsonBlobToJsonTypeTree(asJson);

        console.log(typeTreeToTypescript(asParsedJson));
    } else {
        const fileContents = (await readFile(fileOrUrl)).toString("utf-8");
        const asJson = JSON.parse(fileContents);
        const asParsedJson = jsonBlobToJsonTypeTree(asJson);

        console.log(typeTreeToTypescript(asParsedJson));
    }
}

if (require.main === module) {
    runner();
}
