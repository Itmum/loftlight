// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// const client = new MongoClient(process.env.MONGODB_URI as string);
// const db = client.db("loftlight");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client,
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
// });

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { attachDatabasePool } from "@vercel/functions";

// Created once, at the top of the file, so warm server instances reuse it.
const client = new MongoClient(process.env.MONGODB_URI as string, {
  maxPoolSize: 5, // small pool: free Atlas clusters have a connection limit
  serverSelectionTimeoutMS: 10000, // wait up to 10s before giving up
});
// Tells Vercel to close idle connections before it pauses the server
attachDatabasePool(client);

export const db = client.db("loftlight");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  // Your live address, e.g. https://loftlight-frontend.vercel.app (set in Vercel)
  baseURL: process.env.BETTER_AUTH_URL,
  // Addresses allowed to talk to your auth. Fixes "Invalid origin".
  trustedOrigins: [
    "http://localhost:3000",
    "https://loftlight-frontend.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // BetterAuth's default is 8, but your form allows 6
    autoSignIn: false, // after signup, go to the Login page (as in your brief)
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
