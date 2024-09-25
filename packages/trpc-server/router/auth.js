"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const server_1 = require("@trpc/server");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const trpc_1 = require("../trpc");
const bcrypt = __importStar(require("bcryptjs"));
const db_1 = require("@ntla9aw/db");
const uuid_1 = require("uuid");
const types_1 = require("@ntla9aw/db/types");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../utils");
exports.authRoutes = (0, trpc_1.router)({
    users: (0, trpc_1.privateProcedure)("admin").query(({}) => {
        return db_1.prisma.user.findMany();
    }),
    user: (0, trpc_1.privateProcedure)("admin")
        .input(schemas_1.formSchemaUser)
        .query(({ input: { uid } }) => {
        return db_1.prisma.user.findUnique({ where: { uid } });
    }),
    signIn: trpc_1.publicProcedure
        .input(schemas_1.formSchemaLogin)
        .mutation(async ({ input: { email, password } }) => {
        const credentials = await db_1.prisma.credentials.findUnique({
            where: { email },
            include: { user: true },
        });
        if (!credentials ||
            !bcrypt.compareSync(password, credentials.passwordHash)) {
            throw new Error("Invalid Email or Password");
        }
        const token = (0, jsonwebtoken_1.sign)({
            uid: credentials.uid,
        }, process.env.NEXTAUTH_SECRET || "");
        return {
            user: credentials.user,
            token,
        };
    }),
    registerWithCredentials: trpc_1.publicProcedure
        .input(schemas_1.formSchemaRegister)
        .mutation(async ({ input: { email, name, password, image } }) => {
        const existingUser = await db_1.prisma.credentials.findUnique({
            where: { email: email },
            include: { user: true },
        });
        if (existingUser) {
            throw new server_1.TRPCError({
                code: "BAD_REQUEST",
                message: "User already exists",
            });
        }
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);
        const uid = (0, uuid_1.v4)();
        const user = await db_1.prisma.user.create({
            data: {
                uid,
                name,
                image,
                Credentials: {
                    create: {
                        email,
                        passwordHash,
                    },
                },
                AuthProvider: {
                    create: {
                        type: types_1.AuthProviderType.CREDENTIALS,
                    },
                },
            },
        });
        await db_1.prisma.member.create({
            data: {
                uid
            }
        });
        const token = (0, jsonwebtoken_1.sign)({ uid: user.uid }, process.env.NEXTAUTH_SECRET || "");
        return { user, token };
    }),
    registerWithProvider: trpc_1.publicProcedure
        .input(schemas_1.zodSchemaRegisterWithProvider)
        .mutation(async ({ input }) => {
        const { uid, image, name } = input;
        const user = await db_1.prisma.user.create({
            data: {
                uid,
                name,
                image,
                AuthProvider: {
                    create: {
                        type: types_1.AuthProviderType.CREDENTIALS,
                    },
                },
            },
        });
        await db_1.prisma.member.create({
            data: {
                uid
            }
        });
        const token = (0, jsonwebtoken_1.sign)({ uid: user.uid }, process.env.NEXTAUTH_SECRET || '');
        return { user, token };
    }),
    roles: (0, trpc_1.privateProcedure)().query(async ({ ctx }) => {
        const { uid } = ctx;
        return await (0, utils_1.getUserRoles)(uid);
    })
});
//# sourceMappingURL=auth.js.map