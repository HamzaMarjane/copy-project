"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCContext = void 0;
const createTRPCContext = ({ req, res, }) => {
    const header = req.headers.authorization;
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    return {
        req,
        res,
        token,
        uid: undefined,
    };
};
exports.createTRPCContext = createTRPCContext;
//# sourceMappingURL=context.js.map