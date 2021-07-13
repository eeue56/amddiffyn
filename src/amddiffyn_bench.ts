import {
    typeTreeDiff,
    astTypeTreeDiff,
    jsonBlobToJsonTypeTree,
    typeTreeIsEqual,
    astTypeTreeIsEqual,
} from "./amddiffyn";

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

const almostMixedList: (
    | number
    | string
    | (number | string | { name: string })[]
    | { userId: number }
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
    { userId: 56 },
];

const someJson = {
    glossary: {
        title: "example glossary",
        GlossDiv: {
            title: "S",
            GlossList: {
                GlossEntry: {
                    ID: "SGML",
                    SortAs: "SGML",
                    GlossTerm: "Standard Generalized Markup Language",
                    Acronym: "SGML",
                    Abbrev: "ISO 8879:1986",
                    GlossDef: {
                        para: "A meta-markup language, used to create markup languages such as DocBook.",
                        GlossSeeAlso: [ "GML", "XML" ],
                    },
                    GlossSee: "markup",
                },
            },
        },
    },
};

const complicatedJson = {
    "web-app": {
        servlet: [
            {
                "servlet-name": "cofaxCDS",
                "servlet-class": "org.cofax.cds.CDSServlet",
                "init-param": {
                    "configGlossary:installationAt": "Philadelphia, PA",
                    "configGlossary:adminEmail": "ksm@pobox.com",
                    "configGlossary:poweredBy": "Cofax",
                    "configGlossary:poweredByIcon": "/images/cofax.gif",
                    "configGlossary:staticPath": "/content/static",
                    templateProcessorClass: "org.cofax.WysiwygTemplate",
                    templateLoaderClass: "org.cofax.FilesTemplateLoader",
                    templatePath: "templates",
                    templateOverridePath: "",
                    defaultListTemplate: "listTemplate.htm",
                    defaultFileTemplate: "articleTemplate.htm",
                    useJSP: false,
                    jspListTemplate: "listTemplate.jsp",
                    jspFileTemplate: "articleTemplate.jsp",
                    cachePackageTagsTrack: 200,
                    cachePackageTagsStore: 200,
                    cachePackageTagsRefresh: 60,
                    cacheTemplatesTrack: 100,
                    cacheTemplatesStore: 50,
                    cacheTemplatesRefresh: 15,
                    cachePagesTrack: 200,
                    cachePagesStore: 100,
                    cachePagesRefresh: 10,
                    cachePagesDirtyRead: 10,
                    searchEngineListTemplate: "forSearchEnginesList.htm",
                    searchEngineFileTemplate: "forSearchEngines.htm",
                    searchEngineRobotsDb: "WEB-INF/robots.db",
                    useDataStore: true,
                    dataStoreClass: "org.cofax.SqlDataStore",
                    redirectionClass: "org.cofax.SqlRedirection",
                    dataStoreName: "cofax",
                    dataStoreDriver:
                        "com.microsoft.jdbc.sqlserver.SQLServerDriver",
                    dataStoreUrl:
                        "jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon",
                    dataStoreUser: "sa",
                    dataStorePassword: "dataStoreTestQuery",
                    dataStoreTestQuery: "SET NOCOUNT ON;select test='test';",
                    dataStoreLogFile: "/usr/local/tomcat/logs/datastore.log",
                    dataStoreInitConns: 10,
                    dataStoreMaxConns: 100,
                    dataStoreConnUsageLimit: 100,
                    dataStoreLogLevel: "debug",
                    maxUrlLength: 500,
                },
            },
            {
                "servlet-name": "cofaxEmail",
                "servlet-class": "org.cofax.cds.EmailServlet",
                "init-param": {
                    mailHost: "mail1",
                    mailHostOverride: "mail2",
                },
            },
            {
                "servlet-name": "cofaxAdmin",
                "servlet-class": "org.cofax.cds.AdminServlet",
            },

            {
                "servlet-name": "fileServlet",
                "servlet-class": "org.cofax.cds.FileServlet",
            },
            {
                "servlet-name": "cofaxTools",
                "servlet-class": "org.cofax.cms.CofaxToolsServlet",
                "init-param": {
                    templatePath: "toolstemplates/",
                    log: 1,
                    logLocation: "/usr/local/tomcat/logs/CofaxTools.log",
                    logMaxSize: "",
                    dataLog: 1,
                    dataLogLocation: "/usr/local/tomcat/logs/dataLog.log",
                    dataLogMaxSize: "",
                    removePageCache: "/content/admin/remove?cache=pages&id=",
                    removeTemplateCache:
                        "/content/admin/remove?cache=templates&id=",
                    fileTransferFolder:
                        "/usr/local/tomcat/webapps/content/fileTransferFolder",
                    lookInContext: 1,
                    adminGroupID: 4,
                    betaServer: true,
                },
            },
        ],
        "servlet-mapping": {
            cofaxCDS: "/",
            cofaxEmail: "/cofaxutil/aemail/*",
            cofaxAdmin: "/admin/*",
            fileServlet: "/static/*",
            cofaxTools: "/tools/*",
        },

        taglib: {
            "taglib-uri": "cofax.tld",
            "taglib-location": "/WEB-INF/tlds/cofax.tld",
        },
    },
};

const emptyListParsed = jsonBlobToJsonTypeTree(emptyList);
const mixedListParsed = jsonBlobToJsonTypeTree(mixedList);
const almostMixedListParsed = jsonBlobToJsonTypeTree(almostMixedList);
const someJsonParsed = jsonBlobToJsonTypeTree(someJson);
const complicatedJsonParsed = jsonBlobToJsonTypeTree(complicatedJson);

// diffing

export function benchSimpleDiff() {
    typeTreeDiff(emptyListParsed, mixedListParsed);
}

export function benchSimpleDiffReverse() {
    typeTreeDiff(mixedListParsed, emptyListParsed);
}

export function benchSimpleDiffEmptySame() {
    typeTreeDiff(emptyListParsed, emptyListParsed);
}

export function benchSimpleDiffMixedSame() {
    typeTreeDiff(mixedListParsed, mixedListParsed);
}

export function benchASTDiff() {
    astTypeTreeDiff(emptyListParsed, mixedListParsed);
}

export function benchASTDiffReverse() {
    astTypeTreeDiff(mixedListParsed, emptyListParsed);
}

export function benchASTDiffEmptySame() {
    astTypeTreeDiff(emptyListParsed, emptyListParsed);
}

export function benchASTDiffMixedSame() {
    astTypeTreeDiff(mixedListParsed, mixedListParsed);
}

export function compareDiff() {
    return [
        benchSimpleDiff,
        benchSimpleDiffReverse,
        benchSimpleDiffEmptySame,
        benchSimpleDiffMixedSame,
        benchASTDiff,
        benchASTDiffReverse,
        benchASTDiffEmptySame,
        benchASTDiffMixedSame,
    ];
}

export function benchSimpleDiffAlmostMixed() {
    typeTreeDiff(almostMixedListParsed, mixedListParsed);
}

export function benchSimpleDiffAlmostMixedSame() {
    typeTreeDiff(almostMixedListParsed, almostMixedListParsed);
}

export function benchSimpleDiffAlmostMixedReverse() {
    typeTreeDiff(mixedListParsed, almostMixedListParsed);
}

export function benchASTDiffAlmostMixed() {
    astTypeTreeDiff(almostMixedListParsed, mixedListParsed);
}

export function benchASTDiffAlmostMixedReverse() {
    astTypeTreeDiff(mixedListParsed, almostMixedListParsed);
}

export function benchASTDiffAlmostMixedSame() {
    astTypeTreeDiff(almostMixedListParsed, almostMixedListParsed);
}

export function compareDiffAlmostMixed() {
    return [
        benchSimpleDiffAlmostMixed,
        benchSimpleDiffAlmostMixedReverse,
        benchSimpleDiffAlmostMixedSame,
        benchASTDiffAlmostMixed,
        benchASTDiffAlmostMixedReverse,
        benchASTDiffAlmostMixedSame,
    ];
}

export function benchSimpleDiffJson() {
    typeTreeDiff(someJsonParsed, complicatedJsonParsed);
}

export function benchSimpleDiffJsonSame() {
    typeTreeDiff(someJsonParsed, someJsonParsed);
}

export function benchSimpleDiffJsonReverse() {
    typeTreeDiff(complicatedJsonParsed, someJsonParsed);
}

export function benchASTDiffJson() {
    astTypeTreeDiff(someJsonParsed, complicatedJsonParsed);
}

export function benchASTDiffJsonReverse() {
    astTypeTreeDiff(complicatedJsonParsed, someJsonParsed);
}

export function benchASTDiffJsonSame() {
    astTypeTreeDiff(someJsonParsed, someJsonParsed);
}

export function compareDiffJson() {
    return [
        benchSimpleDiffJson,
        benchSimpleDiffJsonReverse,
        benchSimpleDiffJsonSame,
        benchASTDiffJson,
        benchASTDiffJsonReverse,
        benchASTDiffJsonSame,
    ];
}

// equality

export function benchSimpleEqual() {
    typeTreeIsEqual(emptyListParsed, mixedListParsed);
}

export function benchSimpleEqualReverse() {
    typeTreeIsEqual(mixedListParsed, emptyListParsed);
}

export function benchSimpleEqualEmptySame() {
    typeTreeIsEqual(emptyListParsed, emptyListParsed);
}

export function benchSimpleEqualMixedSame() {
    typeTreeIsEqual(mixedListParsed, mixedListParsed);
}

export function benchASTEqual() {
    astTypeTreeIsEqual(emptyListParsed, mixedListParsed);
}

export function benchASTEqualReverse() {
    astTypeTreeIsEqual(mixedListParsed, emptyListParsed);
}

export function benchASTEqualEmptySame() {
    astTypeTreeIsEqual(emptyListParsed, emptyListParsed);
}

export function benchASTEqualMixedSame() {
    astTypeTreeIsEqual(mixedListParsed, mixedListParsed);
}

export function compareEqual() {
    return [
        benchSimpleEqual,
        benchSimpleEqualReverse,
        benchSimpleEqualEmptySame,
        benchSimpleEqualMixedSame,
        benchASTEqual,
        benchASTEqualReverse,
        benchASTEqualEmptySame,
        benchASTEqualMixedSame,
    ];
}

export function benchSimpleEqualAlmostMixed() {
    typeTreeIsEqual(almostMixedListParsed, mixedListParsed);
}

export function benchSimpleEqualReverseAlmostMixed() {
    typeTreeIsEqual(mixedListParsed, almostMixedListParsed);
}

export function benchASTEqualAlmostMixed() {
    astTypeTreeIsEqual(almostMixedListParsed, mixedListParsed);
}

export function benchASTEqualReverseAlmostMixed() {
    astTypeTreeIsEqual(mixedListParsed, almostMixedListParsed);
}

export function compareEqualAlmostMixed() {
    return [
        benchSimpleEqualAlmostMixed,
        benchSimpleEqualReverseAlmostMixed,
        benchASTEqualAlmostMixed,
        benchASTEqualReverseAlmostMixed,
    ];
}

export function benchEqualJson() {
    typeTreeIsEqual(someJsonParsed, complicatedJsonParsed);
}

export function benchEqualJsonSame() {
    typeTreeIsEqual(someJsonParsed, someJsonParsed);
}

export function benchEqualJsonReverse() {
    typeTreeIsEqual(complicatedJsonParsed, someJsonParsed);
}

export function benchASTEqualJson() {
    astTypeTreeIsEqual(someJsonParsed, complicatedJsonParsed);
}

export function benchASTEqualJsonReverse() {
    astTypeTreeIsEqual(complicatedJsonParsed, someJsonParsed);
}

export function benchASTEqualJsonSame() {
    astTypeTreeIsEqual(someJsonParsed, someJsonParsed);
}

export function compareEqualJson() {
    return [
        benchEqualJson,
        benchEqualJsonReverse,
        benchEqualJsonSame,
        benchASTEqualJson,
        benchASTEqualJsonReverse,
        benchASTEqualJsonSame,
    ];
}
