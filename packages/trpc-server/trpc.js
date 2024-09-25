"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateProcedure = exports.publicProcedure = exports.router = exports.t = void 0;
const server_1 = require("@trpc/server");
const middleware_1 = require("./middleware");
exports.t = server_1.initTRPC.context().create();
exports.router = exports.t.router;
exports.publicProcedure = exports.t.procedure;
const privateProcedure = (...roles) => exports.t.procedure.use((0, middleware_1.isAuthed)(...roles));
exports.privateProcedure = privateProcedure;
//# sourceMappingURL=trpc.js.map