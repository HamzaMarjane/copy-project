import { TRPCError } from "@trpc/server";
import {
  formSchemaLogin,
  formSchemaRegister,
  formSchemaUser,
  zodSchemaRegisterWithProvider,
} from "@ntla9aw/forms/src/schemas";
import { privateProcedure, publicProcedure, router } from "../trpc";
import * as bcrypt from "bcryptjs";
import { prisma } from "@ntla9aw/db";
import { v4 as uuid } from "uuid";
import { AuthProviderType } from "@ntla9aw/db/types";
import { sign } from "jsonwebtoken";
import { getUserRoles } from "../utils";
export const authRoutes = router({
  users: privateProcedure("admin").query(({ }) => {
    return prisma.user.findMany();
  }),
  user: privateProcedure("admin")
    .input(formSchemaUser)
    .query(({  input: { uid } }) => {
      return prisma.user.findUnique({ where: {uid} });
    }),
  signIn: publicProcedure
    .input(formSchemaLogin)
    .mutation(async ({  input: { email, password } }) => {
      const credentials = await prisma.credentials.findUnique({
        where: { email },
        include: { user: true },
      });
      if (
        !credentials ||
        !bcrypt.compareSync(password, credentials.passwordHash)
      ) {
        throw new Error("Invalid Email or Password");
      }
      const token = sign(
        {
          uid: credentials.uid,
        },
        process.env.NEXTAUTH_SECRET || ""
      );
      return {
        user: credentials.user,
        token,
      };
    }),
  registerWithCredentials: publicProcedure
    .input(formSchemaRegister)
    .mutation(async ({ input: { email, name, password, image } }) => {
      const existingUser = await prisma.credentials.findUnique({
        where: { email: email },
        include: { user: true },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }
      const salt = bcrypt.genSaltSync();
      const passwordHash = bcrypt.hashSync(password, salt);
      const uid = uuid();
      const user = await prisma.user.create({
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
              type: AuthProviderType.CREDENTIALS,
            },
          },
        },
      });
      await prisma.member.create({
        data:{
          uid
        }
      })
      const token = sign({ uid: user.uid }, process.env.NEXTAUTH_SECRET || "");
      return { user, token };
    }),
  registerWithProvider: publicProcedure
    .input(zodSchemaRegisterWithProvider)
    .mutation(async ({  input }) => {
      const {  uid, image, name } = input;
      const user = await prisma.user.create({
        data: {
          uid,
          name,
          image,
          AuthProvider: {
            create: {
              type: AuthProviderType.CREDENTIALS,
            },
          },
        },
      });
      await prisma.member.create({
        data:{
          uid
        }
      })
      const token = sign({uid:user.uid}, process.env.NEXTAUTH_SECRET || '')
      return {user,token}
    }),
  roles : privateProcedure().query(async ({ctx})=>{
    const {uid} = ctx
    return await getUserRoles(uid)
  })
});
