const { v4: uuid } = require("uuid");

const { customers } = require("../database");

class CustomerController {
  get(req, res) {
    const { customer } = req;
    return res.status(200).json(customer);
  }

  create(req, res) {
    const { cpf, name } = req.body;

    const customerExists = customers.some((customer) => customer.cpf === cpf);
    if (customerExists) {
      return res.status(400).json({ error: "customer already exists" });
    }

    customers.push({ id: uuid(), cpf, name, statement: [] });
    return res.status(201).send();
  }

  update(req, res) {
    const { customer } = req;
    const { name } = req.body;

    customer.name = name;

    return res.status(200).json(customer);
  }

  delete(req, res) {
    const { customer } = req;
    customers.splice(customer, 1);
    return res.status(204).send();
  }

  withDraw(req, res) {
    const { customer } = req;
    const { description, amount } = req.body;

    const statementOperation = {
      description,
      amount,
      type: "debit",
      created_at: new Date(),
    };

    customer.statement.push(statementOperation);

    return res.status(200).json(customer.statement);
  }

  deposit(req, res) {
    const { customer } = req;
    const { description, amount } = req.body;

    const statementOperation = {
      description,
      amount,
      type: "credit",
      created_at: new Date(),
    };

    customer.statement.push(statementOperation);

    return res.status(200).json(customer.statement);
  }

  statement(req, res) {
    const { customer } = req;
    return res.status(200).json(customer.statement);
  }

  statementByDate(req, res) {
    const { customer } = req;
    const { date } = req.query;

    // + " 00:00" => used to remove any time from date.
    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
      (statement) =>
        statement.created_at.toDateString() ===
        new Date(dateFormat).toDateString()
    );

    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }

    return res.status(200).json(statement);
  }

  getBalance(req, res) {
    const { customer } = req;
    const balance = customer.statement.reduce((acc, operation) => {
      if (operation.type === "credit") return acc + operation.amount;
      if (operation.type === "debit") return acc - operation.amount;
    }, 0);
    return res.status(200).json(balance);
  }
}

const CustomerControllerInitialized = new CustomerController();

module.exports = { CustomerControllerInitialized };
