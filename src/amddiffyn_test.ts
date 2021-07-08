import * as assert from "assert";
import {
    jsonBlobToJsonTypeTree,
    typeTreeToTypescript,
    reduceTypes,
    typeTreeToString,
    typeTreeIsEqual,
    JsonString,
    JsonBoolean,
    JsonNumber,
    JsonList,
    JsonNull,
    JsonObject,
    typeTreeDiff,
    astTypeTreeDiff,
    Same,
    Replace,
    Multiple,
    Insert,
    Remove,
    Json,
} from "./amddiffyn";

export function testBoolean() {
    const falseBool = false;
    const trueBool = true;

    const falseBoolParsed = jsonBlobToJsonTypeTree(falseBool);
    const trueBoolParsed = jsonBlobToJsonTypeTree(trueBool);

    const falseBoolStringTree = typeTreeToString(falseBoolParsed);
    const trueBoolStringTree = typeTreeToString(trueBoolParsed);

    assert.deepStrictEqual(falseBoolStringTree, "boolean");
    assert.deepStrictEqual(trueBoolStringTree, "boolean");

    const falseBoolTypescriptString = typeTreeToTypescript(falseBoolParsed);
    const trueBoolTypeScriptString = typeTreeToTypescript(trueBoolParsed);

    assert.deepStrictEqual(falseBoolTypescriptString, "boolean");
    assert.deepStrictEqual(trueBoolTypeScriptString, "boolean");

    const falseIsEqualToItself = typeTreeIsEqual(
        falseBoolParsed,
        falseBoolParsed
    );
    const trueIsEqualToItself = typeTreeIsEqual(trueBoolParsed, trueBoolParsed);
    const falseAndTrueAreEqual = typeTreeIsEqual(
        falseBoolParsed,
        trueBoolParsed
    );

    const trueAndFalseAndAreEqual = typeTreeIsEqual(
        trueBoolParsed,
        falseBoolParsed
    );

    assert.deepStrictEqual(falseIsEqualToItself, true);
    assert.deepStrictEqual(trueIsEqualToItself, true);

    assert.deepStrictEqual(falseAndTrueAreEqual, true);
    assert.deepStrictEqual(trueAndFalseAndAreEqual, true);
}

export function testNumber() {
    const zero = 0;
    const ten = 10;
    const minusTen = -10;

    const zeroParsed = jsonBlobToJsonTypeTree(zero);
    const tenParsed = jsonBlobToJsonTypeTree(ten);
    const minusTenParsed = jsonBlobToJsonTypeTree(minusTen);

    const zeroStringTree = typeTreeToString(zeroParsed);
    const tenStringTree = typeTreeToString(tenParsed);
    const minusTenStringTree = typeTreeToString(minusTenParsed);

    assert.deepStrictEqual(zeroStringTree, "number");
    assert.deepStrictEqual(tenStringTree, "number");
    assert.deepStrictEqual(minusTenStringTree, "number");

    const zeroTypescriptString = typeTreeToTypescript(zeroParsed);
    const tenTypescriptString = typeTreeToTypescript(tenParsed);
    const minusTenTypescriptString = typeTreeToTypescript(minusTenParsed);

    assert.deepStrictEqual(zeroTypescriptString, "number");
    assert.deepStrictEqual(tenTypescriptString, "number");
    assert.deepStrictEqual(minusTenTypescriptString, "number");
}

export function testNull() {
    const jsonNull = null;

    const jsonNullParsed = jsonBlobToJsonTypeTree(jsonNull);

    const jsonNullStringTree = typeTreeToString(jsonNullParsed);

    assert.deepStrictEqual(jsonNullStringTree, "null");

    const jsonNullTypescriptString = typeTreeToTypescript(jsonNullParsed);

    assert.deepStrictEqual(jsonNullTypescriptString, "null");
}

export function testString() {
    const emptyString = "";
    const shortString = "abcdeflk";

    const emptyStringParsed = jsonBlobToJsonTypeTree(emptyString);
    const shortStringParsed = jsonBlobToJsonTypeTree(shortString);

    const emptyStringStringTree = typeTreeToString(emptyStringParsed);
    const shortStringStringTree = typeTreeToString(shortStringParsed);

    assert.deepStrictEqual(emptyStringStringTree, "string");
    assert.deepStrictEqual(shortStringStringTree, "string");

    const emptyStringTypescriptString = typeTreeToTypescript(emptyStringParsed);
    const shortStringTypescriptString = typeTreeToTypescript(shortStringParsed);

    assert.deepStrictEqual(emptyStringTypescriptString, "string");
    assert.deepStrictEqual(shortStringTypescriptString, "string");
}

export function testList() {
    const emptyList: any[] = [ ];
    const mixedList: (
        | number
        | string
        | (number | string | { name: string })[]
        | { username: string }
    )[] = [
        1,
        "hello",
        2,
        [
            3,
            4,
            "world",
            {
                name: "noah",
            },
        ],
        { username: "eeue56" },
    ];

    const emptyListParsed = jsonBlobToJsonTypeTree(emptyList);
    const mixedListParsed = jsonBlobToJsonTypeTree(mixedList);

    assert.deepStrictEqual(
        typeTreeIsEqual(emptyListParsed, emptyListParsed),
        true
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(mixedListParsed, emptyListParsed),
        false,
        typeTreeDiff(mixedListParsed, emptyListParsed)
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(emptyListParsed, mixedListParsed),
        false,
        typeTreeDiff(emptyListParsed, mixedListParsed)
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(mixedListParsed, mixedListParsed),
        true
    );

    const emptyListStringTree = typeTreeToString(emptyListParsed);
    const mixedListStringTree = typeTreeToString(mixedListParsed);

    assert.deepStrictEqual(emptyListStringTree, "list [ ]");
    assert.deepStrictEqual(
        mixedListStringTree,
        "list [ number, string, number, list [ number, number, string, object { name: string } ], object { username: string } ]"
    );

    const emptyListTypescriptString = typeTreeToTypescript(emptyListParsed);
    const mixedListTypescriptString = typeTreeToTypescript(mixedListParsed);

    assert.deepStrictEqual(emptyListTypescriptString, "any[]");
    assert.deepStrictEqual(
        mixedListTypescriptString,
        "(number | string | (number | string | { name: string })[] | { username: string })[]"
    );
}

export function testObject() {
    const emptyObject = {};
    const mixedObject: {
        name: string;
        age: number;
        pets: { frodo: { alive: boolean } };
    } = {
        name: "noah",
        age: 28,
        pets: {
            frodo: {
                alive: false,
            },
        },
    };
    const mixedObjectWithInvalidChars: {
        name: string;
        age: number;
        pets: { frodo: { alive: boolean } };
        "@id": number;
    } = {
        name: "noah",
        age: 28,
        pets: {
            frodo: {
                alive: false,
            },
        },
        "@id": 12,
    };

    const emptyObjectParsed = jsonBlobToJsonTypeTree(emptyObject);
    const mixedObjectParsed = jsonBlobToJsonTypeTree(mixedObject);
    const mixedObjectWithInvalidCharsParsed = jsonBlobToJsonTypeTree(
        mixedObjectWithInvalidChars
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(emptyObjectParsed, emptyObjectParsed),
        true
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(emptyObjectParsed, mixedObjectParsed),
        false
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(mixedObjectParsed, emptyObjectParsed),
        false
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(mixedObjectParsed, mixedObjectParsed),
        true,
        typeTreeDiff(mixedObjectParsed, mixedObjectParsed)
    );

    assert.deepStrictEqual(
        typeTreeIsEqual(
            mixedObjectWithInvalidCharsParsed,
            mixedObjectWithInvalidCharsParsed
        ),
        true,
        typeTreeDiff(
            mixedObjectWithInvalidCharsParsed,
            mixedObjectWithInvalidCharsParsed
        )
    );

    const emptyObjectStringTree = typeTreeToString(emptyObjectParsed);
    const mixedObjectStringTree = typeTreeToString(mixedObjectParsed);
    const mixedObjectWithInvalidCharsStringTree = typeTreeToString(
        mixedObjectWithInvalidCharsParsed
    );

    assert.deepStrictEqual(emptyObjectStringTree, "object { }");
    assert.deepStrictEqual(
        mixedObjectStringTree,
        "object { name: string, age: number, pets: object { frodo: object { alive: boolean } } }"
    );

    const emptyObjectTypescriptString = typeTreeToTypescript(emptyObjectParsed);
    const mixedObjectTypescriptString = typeTreeToTypescript(mixedObjectParsed);
    const mixedObjectWithInvalidCharsTypescriptString = typeTreeToTypescript(
        mixedObjectWithInvalidCharsParsed
    );

    assert.deepStrictEqual(emptyObjectTypescriptString, "{ }");
    assert.deepStrictEqual(
        mixedObjectTypescriptString,
        "{ name: string, age: number, pets: { frodo: { alive: boolean } } }"
    );
    assert.deepStrictEqual(
        mixedObjectWithInvalidCharsTypescriptString,
        '{ name: string, age: number, pets: { frodo: { alive: boolean } }, "@id": number }'
    );
}

export function testReduceTypes() {
    const allUniqueTypes = [
        JsonString("hello"),
        JsonNumber(123),
        JsonBoolean(true),
        JsonNull(),
        JsonList([ JsonString("hello") ]),
        JsonList([ JsonNumber(123), JsonString("hello") ]),
        JsonObject({}),
        JsonObject({
            name: JsonString("noah"),
        }),
    ];

    const uniqueReducedTypes = reduceTypes(allUniqueTypes);

    assert.deepStrictEqual(uniqueReducedTypes.length, allUniqueTypes.length);

    const someDoubledTypes = [
        JsonString("hello"),
        JsonString("world"),

        JsonNumber(123),
        JsonNumber(123.123),

        JsonBoolean(true),
        JsonBoolean(false),

        JsonNull(),
        JsonNull(),

        JsonList([ JsonString("hello") ]),
        JsonList([ JsonString("world") ]),

        JsonList([ JsonNumber(123), JsonString("hello") ]),
        JsonList([ JsonNumber(123.123), JsonString("world") ]),

        JsonObject({}),
        JsonObject({}),

        JsonObject({
            name: JsonString("noah"),
        }),
        JsonObject({
            name: JsonString("noah"),
        }),
    ];

    const someDoubledReducedTypes = reduceTypes(someDoubledTypes);

    assert.deepStrictEqual(
        someDoubledReducedTypes.length,
        someDoubledTypes.length / 2
    );
}

export function testAstTypeDiffUniqueTypes() {
    const allUniqueTypes = [
        JsonString("hello"),
        JsonNumber(123),
        JsonBoolean(true),
        JsonNull(),
        JsonList([ JsonString("hello") ]),
        JsonObject({
            name: JsonString("noah"),
        }),
    ];

    allUniqueTypes.forEach((uniqueType) => {
        assert.deepStrictEqual(astTypeTreeDiff(uniqueType, uniqueType), Same());
    });

    allUniqueTypes.forEach((uniqueType, i) => {
        allUniqueTypes.forEach((secondUniqueType, j) => {
            if (i === j) return;

            assert.deepStrictEqual(
                astTypeTreeDiff(uniqueType, secondUniqueType).kind,
                "Replace"
            );
        });
    });
}

export function testAstTypeDiffObjects() {
    assert.deepStrictEqual(
        astTypeTreeDiff(
            JsonObject({
                name: JsonString("noah"),
            }),
            JsonObject({
                age: JsonNumber(123),
            })
        ),
        Multiple([
            Remove("name", JsonString("noah")),
            Insert("age", JsonNumber(123)),
        ])
    );

    assert.deepStrictEqual(
        astTypeTreeDiff(
            JsonObject({
                name: JsonString("noah"),
            }),
            JsonNumber(123)
        ),
        Replace(0, JsonObject({ name: JsonString("noah") }), JsonNumber(123))
    );

    assert.deepStrictEqual(
        astTypeTreeDiff(
            JsonObject({
                pets: JsonList([ JsonString("Frodo") ]),
            }),
            JsonObject({
                pets: JsonNumber(123),
            })
        ),
        Multiple([
            Replace("pets", JsonList([ JsonString("Frodo") ]), JsonNumber(123)),
        ])
    );
}

export function testAstTypeDiffNestedObjects() {
    assert.deepStrictEqual(
        astTypeTreeDiff(
            JsonObject({
                pets: JsonList([ JsonObject({ age: JsonNumber(123) }) ]),
            }),
            JsonObject({
                pets: JsonList([ JsonObject({ name: JsonString("Frodo") }) ]),
            })
        ),
        Multiple([
            Replace(
                "pets",
                JsonList([ JsonObject({ age: JsonNumber(123) }) ]),
                JsonList([ JsonObject({ name: JsonString("Frodo") }) ])
            ),
        ])
    );
}

export function testAstTypeDiffComplexNestedObjects() {
    assert.deepStrictEqual(
        astTypeTreeDiff(
            JsonObject({
                person: JsonObject({
                    name: JsonString("Noah"),
                }),
                pets: JsonList([ JsonObject({ age: JsonNumber(123) }) ]),
            }),
            JsonObject({
                pets: JsonList([ JsonObject({ name: JsonString("Frodo") }) ]),
                mountain: JsonString("Du"),
            })
        ),
        Multiple([
            Remove(
                "person",
                JsonObject({
                    name: JsonString("Noah"),
                })
            ),
            Replace(
                "pets",
                JsonList([ JsonObject({ age: JsonNumber(123) }) ]),
                JsonList([ JsonObject({ name: JsonString("Frodo") }) ])
            ),
            Insert("mountain", JsonString("Du")),
        ])
    );
}
