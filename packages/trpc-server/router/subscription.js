"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
// routes/subscription.ts
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const utils_1 = require("../utils");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
exports.subscriptionRoutes = trpc_1.t.router({
    create: trpc_1.t.procedure
        .input(schemas_1.formSchemaSubscription)
        .mutation(async ({ input }) => {
        const { uid, product } = input;
        if (product === "member")
            return;
        // Map product to Stripe price ID
        const priceIdMap = {
            member: process.env.STRIPE_MEMBER_PRICE_ID || '',
            individual: process.env.STRIPE_INDIVIDUAL_PRICE_ID || '',
            organization: process.env.STRIPE_ORGANIZATION_PRICE_ID || '',
        };
        const priceId = priceIdMap[product];
        if (!priceId) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid product selected.',
            });
        }
        // Create a checkout session
        const session = await (0, utils_1.createCheckoutSession)(priceId, uid || '');
        // Optionally update user role immediately or after checkout completion
        await (0, utils_1.updateUserRole)(uid || '', product);
        return { sessionId: session.url };
    }),
});
//# sourceMappingURL=subscription.js.map