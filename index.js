const express = require("express");
const app = express();
require("dotenv").config();
const { getPgVersion, pool } = require("./DB/dbConnect");

const {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser,
} = require("./controllers/controllers.js");

const {
  getAllOrders,
  getOneOrder,
  createOneOrder,
  updateOneOrder,
  deleteOneOrder,
} = require("./controllers/ordersControl.js");

const PORT = process.env.PGPORT || 8000;

// Function to test PostgreSQL connection and get version
async function testDbConnection() {
  try {
    await getPgVersion();
  } catch (error) {
    console.error("Failed to get PostgreSQL version:", error);
  }
}

// Call the function to test database connection
getPgVersion();
app.use(express.json());

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.route("/users").get(getAllUsers).post(createOneUser);
app
  .route("/users/:id")
  .get(getOneUser)
  .put(updateOneUser)
  .delete(deleteOneUser);

console.log(getOneUser);

app.route("/orders").get(getAllOrders).post(createOneOrder);
app
  .route("/orders/:id")
  .get(getOneOrder)
  .put(updateOneOrder)
  .delete(deleteOneOrder);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

console.log(pool);
