const { getCompanies, getCompanyById } = require('../database/methods/companyMethods');
const {
  getSalesOrdersNoInvoice, getSalesOrdersNoDelivery, getInvoicesNoPayment,
  getReturnOrdersNoDelivery, getReturnOrdersNoInvoice,
} = require('../database/methods/orderMethods');
const {
  getOrders, getInvoices, getDeliveries, getPayments, getCreditNotes,
} = require('../jasmin/orders');
const {
  newOrder, newInvoice, newDeliveryNote, newPayment, newCreditNote,
} = require('./purchase');

const pollOrdersCompany = async (companyId) => {
  const orders = await getOrders(companyId);
  const company = await getCompanyById(companyId);
  const mostRecentOrderTime = new Date(company.most_recent_order).getTime();

  const newOrders = orders.data.filter((order) => {
    const time = new Date(order.createdOn);

    return !order.autoCreated && time.getTime() > mostRecentOrderTime;
  });

  newOrders.forEach((order) => newOrder(companyId, order));
};

exports.pollPurchaseOrders = async () => {
  const companies = await getCompanies();
  companies.forEach((company) => {
    pollOrdersCompany(company.id);
  });
};

const pollInvoiceCompany = async (companyId) => {
  const salesOrders = await getSalesOrdersNoInvoice(companyId);
  const salesOrdersId = new Set(salesOrders.map((order) => order.order_id));

  const invoices = await getInvoices(companyId);

  const newInvoices = invoices.filter((invoice) => invoice.documentLines.some((line) => {
    const orderId = line.sourceDocId;
    return salesOrdersId.has(orderId);
  }));

  newInvoices.forEach((invoice) => newInvoice(companyId, invoice));
};

exports.pollInvoice = async () => {
  const companies = await getCompanies();
  companies.forEach((company) => {
    pollInvoiceCompany(company.id);
  });
};

const pollCreditNoteCompany = async (companyId) => {
  const salesOrders = await getReturnOrdersNoInvoice(companyId);
  const salesOrdersId = new Set(salesOrders.map((order) => order.order_id));

  const invoices = await getCreditNotes(companyId);

  const newInvoices = invoices.filter((invoice) => invoice.documentLines.some((line) => {
    const orderId = line.sourceDocId;
    return salesOrdersId.has(orderId);
  }));

  newInvoices.forEach((invoice) => newCreditNote(companyId, invoice));
};

exports.pollCreditNote = async () => {
  const companies = await getCompanies();
  companies.forEach((company) => pollCreditNoteCompany(company.id));
};

const pollDeliveryCompany = async (companyId) => {
  const salesOrders = await getSalesOrdersNoDelivery(companyId);
  const salesOrdersId = new Set(salesOrders.map((order) => order.order_id));

  const returnOrders = await getReturnOrdersNoDelivery(companyId);
  const returnOrdersId = new Set(returnOrders.map((order) => order.order_id));

  const deliveries = await getDeliveries(companyId);

  const newDeliveries = deliveries.filter((delivery) => delivery.documentLines.some((line) => {
    const orderId = line.sourceDocId;
    return salesOrdersId.has(orderId);
  }));

  const newReturnDeliveries = deliveries.filter((delivery) => delivery.documentLines.some(
    (line) => {
      const orderId = line.sourceDocId;
      return returnOrdersId.has(orderId);
    },
  ));

  newDeliveries.forEach((delivery) => newDeliveryNote(companyId, delivery, true));
  newReturnDeliveries.forEach((delivery) => newDeliveryNote(companyId, delivery, false));
};

exports.pollDelivery = async () => {
  const companies = await getCompanies();
  companies.forEach((company) => {
    pollDeliveryCompany(company.id);
  });
};

const pollPaymentCompany = async (companyId) => {
  const invoices = await getInvoicesNoPayment(companyId);
  const invoicesId = new Set(invoices.map((inv) => inv.invoice_id));

  const payments = await getPayments(companyId);

  const newPayments = payments.filter((payment) => payment.documentLines.some((line) => {
    const invoiceId = line.sourceDocId;
    return invoicesId.has(invoiceId);
  }));

  newPayments.forEach((payment) => newPayment(companyId, payment));
};

exports.pollPayment = async () => {
  const companies = await getCompanies();
  companies.forEach((company) => {
    pollPaymentCompany(company.id);
  });
};
