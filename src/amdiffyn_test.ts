import * as assert from "assert";
import * as index from "./amddiffyn";

export function testBoolean() {
    const falseBool = false;
    const trueBool = true;

    const falseBoolParsed = index.jsonBlobToJsonTypeTree(falseBool);
    const trueBoolParsed = index.jsonBlobToJsonTypeTree(trueBool);

    const falseBoolStringTree = index.typeTreeToString(falseBoolParsed);
    const trueBoolStringTree = index.typeTreeToString(trueBoolParsed);

    assert.strictEqual(falseBoolStringTree, "boolean");
    assert.strictEqual(trueBoolStringTree, "boolean");

    const falseBoolTypescriptString = index.typeTreeToTypescript(
        falseBoolParsed
    );
    const trueBoolTypeScriptString = index.typeTreeToTypescript(trueBoolParsed);

    assert.strictEqual(falseBoolTypescriptString, "boolean");
    assert.strictEqual(trueBoolTypeScriptString, "boolean");

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

    assert.strictEqual(falseIsEqualToItself, true);
    assert.strictEqual(trueIsEqualToItself, true);

    assert.strictEqual(falseAndTrueAreEqual, true);
    assert.strictEqual(trueAndFalseAndAreEqual, true);
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

    assert.strictEqual(zeroStringTree, "number");
    assert.strictEqual(tenStringTree, "number");
    assert.strictEqual(minusTenStringTree, "number");

    const zeroTypescriptString = index.typeTreeToTypescript(zeroParsed);
    const tenTypescriptString = index.typeTreeToTypescript(tenParsed);
    const minusTenTypescriptString = index.typeTreeToTypescript(minusTenParsed);

    assert.strictEqual(zeroTypescriptString, "number");
    assert.strictEqual(tenTypescriptString, "number");
    assert.strictEqual(minusTenTypescriptString, "number");
}

export function testNull() {
    const jsonNull = null;

    const jsonNullParsed = index.jsonBlobToJsonTypeTree(jsonNull);

    const jsonNullStringTree = index.typeTreeToString(jsonNullParsed);

    assert.strictEqual(jsonNullStringTree, "null");

    const jsonNullTypescriptString = index.typeTreeToTypescript(jsonNullParsed);

    assert.strictEqual(jsonNullTypescriptString, "null");
}

export function testString() {
    const emptyString = "";
    const shortString = "abcdeflk";

    const emptyStringParsed = index.jsonBlobToJsonTypeTree(emptyString);
    const shortStringParsed = index.jsonBlobToJsonTypeTree(shortString);

    const emptyStringStringTree = index.typeTreeToString(emptyStringParsed);
    const shortStringStringTree = index.typeTreeToString(shortStringParsed);

    assert.strictEqual(emptyStringStringTree, "string");
    assert.strictEqual(shortStringStringTree, "string");

    const emptyStringTypescriptString = index.typeTreeToTypescript(
        emptyStringParsed
    );
    const shortStringTypescriptString = index.typeTreeToTypescript(
        shortStringParsed
    );

    assert.strictEqual(emptyStringTypescriptString, "string");
    assert.strictEqual(shortStringTypescriptString, "string");
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

    assert.strictEqual(emptyListStringTree, "list [ ]");
    assert.strictEqual(
        mixedListStringTree,
        "list [ number, string, number, list [ number, number, string, object { name: string } ], object { username: string } ]"
    );

    const emptyListTypescriptString = index.typeTreeToTypescript(
        emptyListParsed
    );
    const mixedListTypescriptString = index.typeTreeToTypescript(
        mixedListParsed
    );

    assert.strictEqual(emptyListTypescriptString, "any[]");
    assert.strictEqual(
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

    assert.strictEqual(emptyObjectStringTree, "object { }");
    assert.strictEqual(
        mixedObjectStringTree,
        "object { name: string, age: number, pets: object { frodo: object { alive: boolean } } }"
    );

    const emptyObjectTypescriptString = index.typeTreeToTypescript(
        emptyObjectParsed
    );
    const mixedObjectTypescriptString = index.typeTreeToTypescript(
        mixedObjectParsed
    );

    assert.strictEqual(emptyObjectTypescriptString, "{ }");
    assert.strictEqual(
        mixedObjectTypescriptString,
        "{ name: string, age: number, pets: { frodo: { alive: boolean } } }"
    );
}
