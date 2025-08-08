const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const pixRoutes = require('./routes/pixRoutes');
app.use('/api/pix', pixRoutes);

app.listen(3000, () => {
  console.log('🚀 API Pix rodando na porta 3000');
});
