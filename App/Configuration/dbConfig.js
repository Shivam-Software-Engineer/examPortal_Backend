// const { MongoClient } = require("mongodb");
// require("dotenv").config(); // ✅ must be at the top

// const uri = process.env.DB_CONNECTION;
// const dbName = process.env.DB_NAME;

// // ✅ Add options for TLS
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   ssl: true, // <-- this is essential for Atlas
//   tlsAllowInvalidCertificates: false, // optional, you can remove if not needed
// });

// let dbConnection = async () => {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     console.log(`✅ Connected to MongoDB: ${dbName}`);
//     return db;
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     throw err;
//   }
// };

// module.exports = { dbConnection };


// const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017/";
// const client = new MongoClient(uri);
// const dbName = "myProject";

// let dbConnection = async () => {
//   try {
//     await client.connect();  // ✅ brackets added
//     const db = client.db(dbName);
//     console.log(`✅ Connected to MongoDB: ${dbName}`);
//     return db;
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     throw err;
//   }
// };

// module.exports = { dbConnection };

