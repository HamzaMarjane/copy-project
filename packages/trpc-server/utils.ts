import { prisma } from "@ntla9aw/db";
import { Role } from "./types";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

export const getUserRoles = async (uid: string | undefined): Promise<Role[]> => {
  try {
    if(typeof uid === undefined) throw new Error
    const [adminExists,organizationExists,individualExists, memberExists] =
      await Promise.all([
        prisma.admin.findUnique({ where: { uid } }),
        prisma.organization.findUnique({ where: { uid } }),
        prisma.individual.findUnique({ where: { uid } }),
        prisma.member.findUnique({ where: { uid } }),
      ]);

    const roles: Role[] = [];
    if (adminExists) roles.push("admin");
    if (organizationExists) roles.push("organization");
    if (individualExists) roles.push("individual");
    if (memberExists) roles.push("member");

    return roles;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    throw error;
  }
};

export const authorizeUser = async (
  uid: string,
  roles: Role[]
): Promise<void> => {
  if (!roles || roles.length === 0) {
    return; // No specific roles required, access is granted
  }

  const userRoles = await getUserRoles(uid);
console.log("userRoles",userRoles)
  if (!userRoles.some((role) => roles.includes(role))) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have the required role(s).",
    });
  } 
};

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

const stripe = new Stripe('sk_test_51OUa9dLmvsbhgqSLp5e7xSMeLiQ7luTa1kpm5QZnA2H94IwQoSfKa7FhphI1fDhhGbDEgmauMqRAEcsr1BSrhoo100s3Uyvg7x' , {
  apiVersion: "2024-06-20",
});

// Create a checkout session
export const createCheckoutSession = async (priceId: string, uid: string) => {
  console.log('priceId',priceId)
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

// Update user role based on subscription

export const updateUserRole = async (uid: string, role: string) => {
  switch (role) {
    case "member":
      // Check if the user is already a member
      const existingMember = await prisma.member.findUnique({
        where: { uid },
      });

      if (!existingMember) {
        await prisma.member.create({
          data: {
            uid,
          },
        });
      }
      break;

    case "individual":
      // Check if the user is already an individual
      const existingIndividual = await prisma.individual.findUnique({
        where: { uid },
      });

      if (!existingIndividual) {
        await prisma.individual.create({
          data: {
            uid,
          },
        });
      }
      break;

    case "organization":
      // Check if the user is already an organization
      const existingOrganization = await prisma.organization.findUnique({
        where: { uid },
      });

      if (!existingOrganization) {
        await prisma.organization.create({
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
