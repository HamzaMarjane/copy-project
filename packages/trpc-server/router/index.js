"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const auth_1 = require("./auth");
const community_1 = require("./community");
const event_1 = require("./event");
const subscription_1 = require("./subscription");
const navigation_1 = require("./navigation");
const tag_1 = require("./tag");
const ticket_1 = require("./ticket");
const statistic_1 = require("./statistic");
const dashboard_1 = require("./dashboard");
exports.appRouter = (0, trpc_1.router)({
    dashboard: dashboard_1.dashboardRoutes,
    statistic: statistic_1.statisticRoutes,
    ticket: ticket_1.ticketRoutes,
    tag: tag_1.tagRoutes,
    navigation: navigation_1.navigationRoutes,
    auth: auth_1.authRoutes,
    community: community_1.communityRoutes,
    event: event_1.eventRoutes,
    upgrade: subscription_1.subscriptionRoutes
});
//# sourceMappingURL=index.js.map