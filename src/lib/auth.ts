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

// version2

// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// // Same as the BetterAuth documentation: default MongoDB settings
// // (the driver waits up to 30 seconds for the first connection).
// const client = new MongoClient(process.env.MONGODB_URI as string);
// const db = client.db("loftlight");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client,
//   }),

//   baseURL: process.env.BETTER_AUTH_URL,
//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://loftlight-frontend.vercel.app",
//   ],

//   emailAndPassword: {
//     enabled: true,
//     minPasswordLength: 6, // your form allows 6, BetterAuth's default is 8
//     // autoSignIn: false, // after signup, go to the Login page (your brief)
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
// });

// version 3

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// A MongoClient that fails to connect is closed for good ("Topology is closed").
// So we try up to 3 times, with a brand-new client each time, and only hand
// BetterAuth a client that is really connected.
async function connectWithRetry(attempts = 3): Promise<MongoClient> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const client = new MongoClient(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 8000, // 3 tries x 8s, instead of one 30s wait
    });
    try {
      await client.connect();
      return client;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error);
      await client.close().catch(() => {});
    }
  }
  throw new Error("Could not connect to MongoDB after several attempts.");
}

const client = await connectWithRetry();
const db = client.db("loftlight");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://loftlight-frontend.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // your form allows 6, BetterAuth's default is 8
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
