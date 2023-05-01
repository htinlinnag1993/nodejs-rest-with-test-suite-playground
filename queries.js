const Pool = require('pg').Pool;
const PostgresqlConfig = require('./credentials');

const pool = new Pool(PostgresqlConfig.POSTGRESQL_CONFIG);

const logRequest = (request) => {
  console.log("Request Info: ", {
    endpoint: request.url,
    method: request.method,
    params: request.params,
    body: request.body
  });
};

// const logResponse = (response) => {
//   console.log("Request Info: ", {
//     status: response.status,
//     message: response.message,
//     body: response.body,
//   });
// };

const getUsers = (request, response) => {
  logRequest(request);
  
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
};

const getUserById = (request, response) => {
  logRequest(request);
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw Error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  logRequest(request);
  const { name, email } = request.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`);
  });
};

const updateUser = (request, response) => {
  logRequest(request);
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  logRequest(request);
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
