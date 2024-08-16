import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}
// this file did not run because of the framework so we need to add export GET, POST etc.