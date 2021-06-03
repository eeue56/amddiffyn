import * as assert from "assert";
import * as index from "./amddiffyn";

export function testBoolean() {
    const falseBool = false;
    const trueBool = true;

    const falseBoolParsed = index.jsonBlobToJsonTypeTree(falseBool);
    const trueBoolParsed = index.jsonBlobToJsonTypeTree(trueBool);

    const falseBoolStringTree = index.typeTreeToString(falseBoolParsed);
    const trueBoolStringTree = index.typeTreeToString(trueBoolParsed);

    assert.deepStrictEqual(falseBoolStringTree, "boolean");
    assert.deepStrictEqual(trueBoolStringTree, "boolean");

    const falseBoolTypescriptString = index.typeTreeToTypescript(
        falseBoolParsed
    );
    const trueBoolTypeScriptString = index.typeTreeToTypescript(trueBoolParsed);

    assert.deepStrictEqual(falseBoolTypescriptString, "boolean");
    assert.deepStrictEqual(trueBoolTypeScriptString, "boolean");

    const falseIsEqualToItself = index.typeTreeIsEqual(
        falseBoolParsed,
        falseBoolParsed
    );
    const trueIsEqualToItself = index.typeTreeIsEqual(
        trueBoolParsed,
        trueBoolParsed
    );
    const falseAndTrueAreEqual = index.typeTreeIsEqual(
        falseBoolParsed,
        trueBoolParsed
    );

    const trueAndFalseAndAreEqual = index.typeTreeIsEqual(
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

    const zeroParsed = index.jsonBlobToJsonTypeTree(zero);
    const tenParsed = index.jsonBlobToJsonTypeTree(ten);
    const minusTenParsed = index.jsonBlobToJsonTypeTree(minusTen);

    const zeroStringTree = index.typeTreeToString(zeroParsed);
    const tenStringTree = index.typeTreeToString(tenParsed);
    const minusTenStringTree = index.typeTreeToString(minusTenParsed);

    assert.deepStrictEqual(zeroStringTree, "number");
    assert.deepStrictEqual(tenStringTree, "number");
    assert.deepStrictEqual(minusTenStringTree, "number");

    const zeroTypescriptString = index.typeTreeToTypescript(zeroParsed);
    const tenTypescriptString = index.typeTreeToTypescript(tenParsed);
    const minusTenTypescriptString = index.typeTreeToTypescript(minusTenParsed);

    assert.deepStrictEqual(zeroTypescriptString, "number");
    assert.deepStrictEqual(tenTypescriptString, "number");
    assert.deepStrictEqual(minusTenTypescriptString, "number");
}

export function testNull() {
    const jsonNull = null;

    const jsonNullParsed = index.jsonBlobToJsonTypeTree(jsonNull);

    const jsonNullStringTree = index.typeTreeToString(jsonNullParsed);

    assert.deepStrictEqual(jsonNullStringTree, "null");

    const jsonNullTypescriptString = index.typeTreeToTypescript(jsonNullParsed);

    assert.deepStrictEqual(jsonNullTypescriptString, "null");
}

export function testString() {
    const emptyString = "";
    const shortString = "abcdeflk";

    const emptyStringParsed = index.jsonBlobToJsonTypeTree(emptyString);
    const shortStringParsed = index.jsonBlobToJsonTypeTree(shortString);

    const emptyStringStringTree = index.typeTreeToString(emptyStringParsed);
    const shortStringStringTree = index.typeTreeToString(shortStringParsed);

    assert.deepStrictEqual(emptyStringStringTree, "string");
    assert.deepStrictEqual(shortStringStringTree, "string");

    const emptyStringTypescriptString = index.typeTreeToTypescript(
        emptyStringParsed
    );
    const shortStringTypescriptString = index.typeTreeToTypescript(
        shortStringParsed
    );

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

    const emptyListParsed = index.jsonBlobToJsonTypeTree(emptyList);
    const mixedListParsed = index.jsonBlobToJsonTypeTree(mixedList);

    const emptyListStringTree = index.typeTreeToString(emptyListParsed);
    const mixedListStringTree = index.typeTreeToString(mixedListParsed);

    assert.deepStrictEqual(emptyListStringTree, "list [ ]");
    assert.deepStrictEqual(
        mixedListStringTree,
        "list [ number, string, number, list [ number, number, string, object { name: string } ], object { username: string } ]"
    );

    const emptyListTypescriptString = index.typeTreeToTypescript(
        emptyListParsed
    );
    const mixedListTypescriptString = index.typeTreeToTypescript(
        mixedListParsed
    );

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

    const emptyObjectParsed = index.jsonBlobToJsonTypeTree(emptyObject);
    const mixedObjectParsed = index.jsonBlobToJsonTypeTree(mixedObject);

    const emptyObjectStringTree = index.typeTreeToString(emptyObjectParsed);
    const mixedObjectStringTree = index.typeTreeToString(mixedObjectParsed);

    assert.deepStrictEqual(emptyObjectStringTree, "object { }");
    assert.deepStrictEqual(
        mixedObjectStringTree,
        "object { name: string, age: number, pets: object { frodo: object { alive: boolean } } }"
    );

    const emptyObjectTypescriptString = index.typeTreeToTypescript(
        emptyObjectParsed
    );
    const mixedObjectTypescriptString = index.typeTreeToTypescript(
        mixedObjectParsed
    );

    assert.deepStrictEqual(emptyObjectTypescriptString, "{ }");
    assert.deepStrictEqual(
        mixedObjectTypescriptString,
        "{ name: string, age: number, pets: { frodo: { alive: boolean } } }"
    );
}
