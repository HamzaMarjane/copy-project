"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthed = void 0;
const server_1 = require("@trpc/server");
const trpc_1 = require("./trpc");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("./utils");
const isAuthed = (...roles) => trpc_1.t.middleware(async (opts) => {
    const { token } = opts.ctx;
    if (!token) {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: "Token is required"
        });
    }
    let uid;
    try {
        console.log("token", token);
        const user = await (0, jsonwebtoken_1.verify)(token, process.env.NEXTAUTH_SECRET || '');
        uid = user.uid;
        console.log("Decoded UID from JWT:", uid);
    }
    catch (error) {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: "Token is required"
        });
    }
    if (roles.length > 0) {
        await (0, utils_1.authorizeUser)(uid, roles);
    }
    return opts.next(Object.assign(Object.assign({}, opts), { ctx: Object.assign(Object.assign({}, opts.ctx), { uid }) }));
});
exports.isAuthed = isAuthed;
//# sourceMappingURL=middleware.js.map