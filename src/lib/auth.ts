import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { after } from "next/server";
import { profileName, profilePhone, profilePhoto } from "@/lib/profile-fields";
import { sendPasswordResetEmail } from "@/lib/resend";
import { sql } from "@/lib/sql";

export const auth = betterAuth({
  database: sql,
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 30 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword({ user, url }) {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/reset-password");

      return sendPasswordResetEmail(user.email, link.href);
    },
  },
  verification: { storeIdentifier: "hashed" },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        validator: { input: profilePhone },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/update-user") return;

      const name = profileName.optional().safeParse(ctx.body?.name);
      const image = profilePhoto.nullish().safeParse(ctx.body?.image);
      const issue = name.error?.issues[0] ?? image.error?.issues[0];

      if (issue) {
        throw new APIError("BAD_REQUEST", { message: issue.message });
      }

      return {
        context: {
          body: { ...ctx.body, name: name.data, image: image.data },
        },
      };
    }),
  },
  advanced: {
    backgroundTasks: { handler: (task) => after(task) },
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  plugins: [admin(), nextCookies()],
});
