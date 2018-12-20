const SessionStore = require('express-mysql-session');
const db_config = require('../sql/config');
const sessionStore = new SessionStore(db_config.config)
module.exports = { sessionStore }
