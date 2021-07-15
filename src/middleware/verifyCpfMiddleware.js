const { customers } = require("../database");

function verifyCpfMiddleware(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();
}

module.exports = verifyCpfMiddleware;
