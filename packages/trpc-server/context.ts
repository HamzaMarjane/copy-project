import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
export const createTRPCContext = ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  return {
    req,
    res,
    token,
    uid: undefined as string | undefined,
  };
};
