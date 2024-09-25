import { inferRouterOutputs } from '@trpc/server'
import { router} from '../trpc'

import { authRoutes } from './auth'
import { communityRoutes} from './community'
import { eventRoutes } from './event'
import { subscriptionRoutes } from './subscription'
import { navigationRoutes} from './navigation'
import { tagRoutes } from './tag'
import { ticketRoutes } from './ticket'
import { statisticRoutes } from './statistic'
import { dashboardRoutes } from './dashboard'
export const appRouter = router({
    dashboard:dashboardRoutes,
    statistic:statisticRoutes,
    ticket:ticketRoutes,
    tag:tagRoutes,
    navigation:navigationRoutes,    
    auth:authRoutes,
    community:communityRoutes,
    event:eventRoutes,
    upgrade:subscriptionRoutes
})
export type AppRouter = typeof appRouter
export type AppRouterType = inferRouterOutputs<AppRouter>