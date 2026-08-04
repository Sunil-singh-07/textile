import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  console.log("Connecting...");
  await client.connect();
  console.log("Connected!");

  await client.db("admin").command({ ping: 1 });

  console.log("✅ MongoDB Connected");
} catch (err) {
  console.error(err);
} finally {
  await client.close();
}