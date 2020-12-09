const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const middlewares = require('./middlewares');
const config = require('./config').express;
const db = require('./database/knex');
const { pollPurchaseOrders, pollInvoice, pollDelivery } = require('./processes/poll');

const app = express();

// middleware
app.use(cors({ maxAge: config.maxAge }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.timeout(config.timeout));

app.db = db;
app.use('/', routes);
app.use(middlewares.notFound);
app.use(middlewares.error);

pollPurchaseOrders();
setInterval(pollPurchaseOrders, config.pollInterval);

setTimeout(() => {
  pollInvoice();
  setInterval(pollInvoice, config.pollInterval);
}, config.pollInterval / 3);

setTimeout(() => {
  pollDelivery();
  setInterval(pollDelivery, config.pollInterval);
}, (config.pollInterval * 2) / 3);

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}.`);
});
