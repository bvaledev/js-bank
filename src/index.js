const express = require('express');
const app = express();
const { CustomerControllerInitialized } = require('./controller/CustomerController');
const verifyCpfMiddleware = require('./middleware/verifyCpfMiddleware')

app.use(express.json());

app.post('/customer', CustomerControllerInitialized.create);
app.get('/customer', [verifyCpfMiddleware], CustomerControllerInitialized.get);
app.delete('/customer', [verifyCpfMiddleware], CustomerControllerInitialized.delete);
app.put('/customer', [verifyCpfMiddleware], CustomerControllerInitialized.update);
app.post('/customer/deposit', [verifyCpfMiddleware], CustomerControllerInitialized.deposit);
app.post('/customer/withdraw', [verifyCpfMiddleware], CustomerControllerInitialized.withDraw);
app.get('/customer/statement', [verifyCpfMiddleware], CustomerControllerInitialized.statement);
app.get('/customer/statement/date', [verifyCpfMiddleware], CustomerControllerInitialized.statementByDate);
app.get('/customer/balance', [verifyCpfMiddleware], CustomerControllerInitialized.getBalance);

app.listen(3001, () => {
    console.log('open');
});
