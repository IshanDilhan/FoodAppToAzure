import createHandler from "azure-function-express";

export default (context, req) => {
    return import("../index.js").then(({ default: app }) => {
        return createHandler(app)(context, req);
    }).catch(err => {
        context.res = {
            status: 500,
            body: "Initialization Error: " + err.message + "\n" + err.stack
        };
    });
}
