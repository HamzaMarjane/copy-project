"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.createCheckoutSession = exports.authorizeUser = exports.getUserRoles = void 0;
const db_1 = require("@ntla9aw/db");
const server_1 = require("@trpc/server");
const stripe_1 = __importDefault(require("stripe"));
const getUserRoles = async (uid) => {
    try {
        if (typeof uid === undefined)
            throw new Error;
        const [adminExists, organizationExists, individualExists, memberExists] = await Promise.all([
            db_1.prisma.admin.findUnique({ where: { uid } }),
            db_1.prisma.organization.findUnique({ where: { uid } }),
            db_1.prisma.individual.findUnique({ where: { uid } }),
            db_1.prisma.member.findUnique({ where: { uid } }),
        ]);
        const roles = [];
        if (adminExists)
            roles.push("admin");
        if (organizationExists)
            roles.push("organization");
        if (individualExists)
            roles.push("individual");
        if (memberExists)
            roles.push("member");
        return roles;
    }
    catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
};
exports.getUserRoles = getUserRoles;
const authorizeUser = async (uid, roles) => {
    if (!roles || roles.length === 0) {
        return; // No specific roles required, access is granted
    }
    const userRoles = await (0, exports.getUserRoles)(uid);
    console.log("userRoles", userRoles);
    if (!userRoles.some((role) => roles.includes(role))) {
        throw new server_1.TRPCError({
            code: "FORBIDDEN",
            message: "User does not have the required role(s).",
        });
    }
};
exports.authorizeUser = authorizeUser;
// export const checkRowLevelPermission = async (
//   uid: string,
//   allowedUids: string | string[],
//   allowedRoles: Role[] = ["admin"]
// ) => {
//   const userRoles = await getUserRoles(uid);
//   if (userRoles?.some((role) => allowedRoles.includes(role))) {
//     return true;
//   }
//   const uids =
//     typeof allowedUids === "string"
//       ? [allowedUids]
//       : allowedUids.filter(Boolean);
//   if (!uids.includes(uid)) {
//     throw new TRPCError({
//       code: "FORBIDDEN",
//       message: "You are not allowed to do this action.",
//     });
//   }
// };
// utils/stripe.ts
const stripe = new stripe_1.default('sk_test_51OUa9dLmvsbhgqSLp5e7xSMeLiQ7luTa1kpm5QZnA2H94IwQoSfKa7FhphI1fDhhGbDEgmauMqRAEcsr1BSrhoo100s3Uyvg7x', {
    apiVersion: "2024-06-20",
});
// Create a checkout session
const createCheckoutSession = async (priceId, uid) => {
    console.log('priceId', priceId);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `http://localhost:3000/auth/community`,
        cancel_url: `http://localhost:3000/auth/subscription?cancel=true`,
        metadata: {
            uid, // Store user ID for later use
        },
    });
    console.log("Checkout Session:", session);
    return session;
};
exports.createCheckoutSession = createCheckoutSession;
// Update user role based on subscription
const updateUserRole = async (uid, role) => {
    switch (role) {
        case "member":
            // Check if the user is already a member
            const existingMember = await db_1.prisma.member.findUnique({
                where: { uid },
            });
            if (!existingMember) {
                await db_1.prisma.member.create({
                    data: {
                        uid,
                    },
                });
            }
            break;
        case "individual":
            // Check if the user is already an individual
            const existingIndividual = await db_1.prisma.individual.findUnique({
                where: { uid },
            });
            if (!existingIndividual) {
                await db_1.prisma.individual.create({
                    data: {
                        uid,
                    },
                });
            }
            break;
        case "organization":
            // Check if the user is already an organization
            const existingOrganization = await db_1.prisma.organization.findUnique({
                where: { uid },
            });
            if (!existingOrganization) {
                await db_1.prisma.organization.create({
                    data: {
                        uid,
                    },
                });
            }
            break;
        default:
            throw new Error(`Role ${role} is not recognized.`);
    }
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=utils.js.map