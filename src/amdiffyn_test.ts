import * as assert from "assert";
import {
    jsonBlobToJsonTypeTree,
    typeTreeToTypescript,
    reduceTypes,
    typeTreeToString,
    typeTreeIsEqual,
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

    const emptyObjectParsed = jsonBlobToJsonTypeTree(emptyObject);
    const mixedObjectParsed = jsonBlobToJsonTypeTree(mixedObject);

    const emptyObjectStringTree = typeTreeToString(emptyObjectParsed);
    const mixedObjectStringTree = typeTreeToString(mixedObjectParsed);

    assert.deepStrictEqual(emptyObjectStringTree, "object { }");
    assert.deepStrictEqual(
        mixedObjectStringTree,
        "object { name: string, age: number, pets: object { frodo: object { alive: boolean } } }"
    );

    const emptyObjectTypescriptString = typeTreeToTypescript(emptyObjectParsed);
    const mixedObjectTypescriptString = typeTreeToTypescript(mixedObjectParsed);

    assert.deepStrictEqual(emptyObjectTypescriptString, "{ }");
    assert.deepStrictEqual(
        mixedObjectTypescriptString,
        "{ name: string, age: number, pets: { frodo: { alive: boolean } } }"
    );
}
