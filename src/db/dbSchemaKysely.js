const { Kysely, PostgresDialect } = require('kysely');
const { Table } = require('kysely');

const users = {
  id: 'uuid',
  name: 'text',
  username: 'text',
  password: 'text',
  roles: 'text',
  reset_token: 'text',            
  reset_token_expires: 'timestamp' 
};

module.exports = { users };
