"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpcExpress = void 0;
const express_1 = require("@trpc/server/adapters/express");
const router_1 = require("./router");
const context_1 = require("./context");
exports.trpcExpress = (0, express_1.createExpressMiddleware)({
    router: router_1.appRouter,
    createContext: context_1.createTRPCContext
});
//# sourceMappingURL=index.js.map