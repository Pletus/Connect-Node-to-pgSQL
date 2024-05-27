const { pool } = require('../DB/dbConnect');

const getAllOrders = (req, res) => {
  // const query = 'SELECT * FROM orders';
  pool.query('SELECT * FROM orders', (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
};

const getOneOrder = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    if (results) {
      res.status(200).json(results.rows);
    }
  });
};

const createOneOrder = (req, res) => {
  const { name, email } = req.body;
  pool.query(
    'SELECT * FROM orders WHERE email = $1',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows > 0) {
        res.send('Order already exists!');
      } else {
        pool.query(
          'INSERT INTO orders(name, email) VALUES($1, $2)',
          [name, email],
          (error, results) => {
            if (error) {
              throw error;
            }
            res.send(`Order was created!`);
          }
        );
      }
    }
  );
};

const updateOneOrder = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    pool.query(
      'UPDATE orders SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.send(`Order with ID ${id} was updated!`);
      }
    );
  };

const deleteOneOrder = (req, res) => {
    const { id } = req.params;
    pool.query(
      'DELETE FROM orders WHERE id = $1',
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.send(`Order with ID ${id} was deleted!`);
      }
    );
  };

module.exports = {
  getAllOrders,
  getOneOrder,
  createOneOrder,
  updateOneOrder,
  deleteOneOrder,
};
