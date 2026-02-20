import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { parseSiweMessage, type SiweMessage } from "viem/siwe";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { prisma } from "@trading-cup/database";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      id: "siwe",
      name: "Ethereum",
      credentials: {
        message: { type: "text" },
        signature: { type: "text" },
      },
      async authorize(credentials) {
        try {
          const message = credentials.message as string;
          const signature = credentials.signature as `0x${string}`;

          const siweMessage = parseSiweMessage(message) as SiweMessage;

          const valid = await publicClient.verifySiweMessage({
            message,
            signature,
          });

          if (!valid) return null;

          const address = siweMessage.address;

          const user = await prisma.user.upsert({
            where: { walletAddress: address },
            update: {},
            create: { walletAddress: address },
          });

          return {
            id: user.id,
            name: address,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.address = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.address) {
        session.user.name = token.address as string;
      }
      return session;
    },
  },
});
