const { pool } = require('../DB/dbConnect');

const getAllOrders = (req, res) => {
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
  const { id } = req.params;
  const { price, date, user_id } = req.body;

  pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).send('Error querying the database');
      }
      if (results.rows.length > 0) {
        return res.status(400).send('order already exists!');
      } else {
        pool.query(
          'INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3)',
          [price, date, user_id],
          (error, results) => {
            if (error) {
              return res.status(500).send('Error inserting order into the database');
            }
            res.status(201).send('order was created!');
          }
        );
      }
    }
  );
};

const updateOneOrder = (req, res) => {
  const { id } = req.params;
  const { date, price, user_id } = req.body;

  if (!id || !date || !price || !user_id) {
    return res.status(400).send('Missing required fields');
  }

  pool.query(
    'UPDATE orders SET date = $1, price = $2, user_id = $3 WHERE id = $4',
    [date, price, user_id, id],
    (error, results) => {
      if (error) {
        console.error('Error updating order in the database::', error);
        return res.status(500).send('Error updating order in the database:');
      }
      if (results.rowCount === 0) {
        return res.status(404).send(`Order with ${id} not found`);
      }
      res.send(`¡Order with ID ${id} found!`);
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
