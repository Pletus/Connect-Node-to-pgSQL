const { pool } = require("../DB/dbConnect");

const getAllUsers = (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
};

const getOneUser = (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    if (results) {
      res.status(200).json(results.rows);
    }
  });
};

const createOneUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age } = req.body;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(500).send("Error querying the database");
    }
    if (results.rows.length > 0) {
      return res.status(400).send("User already exists!");
    } else {
      pool.query(
        "INSERT INTO users(first_name, last_name, age, active) VALUES($1, $2, $3, true)",
        [first_name, last_name, age],
        (error, results) => {
          if (error) {
            return res
              .status(500)
              .send("Error inserting user into the database");
          }
          res.status(201).send("User was created!");
        }
      );
    }
  });
};

const updateOneUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;

  if (
    !id ||
    !first_name ||
    !last_name ||
    age === undefined ||
    active === undefined
  ) {
    return res.status(400).send("Missing required fields");
  }

  pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, age = $3, active = $4 WHERE id = $5",
    [first_name, last_name, age, active, id],
    (error, results) => {
      if (error) {
        console.error("Error updating user in the database:", error);
        return res.status(500).send("Error updating user in the database");
      }
      if (results.rowCount === 0) {
        return res.status(404).send(`User with ID ${id} not found`);
      }
      res.status(200).send(`User with ID ${id} was updated successfully!`);
    }
  );
};

const deleteOneUser = (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.send(`User with ID ${id} was deleted!`);
  });
};

const getLinkedUsers = (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM orders INNER JOIN users ON users.id = orders.user_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.json(results.rows);
    }
  );
};

module.exports = {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser,
  getLinkedUsers,
};
