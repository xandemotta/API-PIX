const express = require('express');
const router = express.Router();
const { gerarCobranca, gerarQRCode, consultarCobranca, enviarPixEmMassa } = require('../services/gnPixService');

// Criar cobrança com QR dinâmico
router.post('/criar', async (req, res) => {
  try {
    const cobranca = await gerarCobranca(req.body);
    const qr = await gerarQRCode(cobranca.loc.id);
    res.json({ cobranca, qr });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Consultar cobrança
router.get('/consultar/:txid', async (req, res) => {
  try {
    const resultado = await consultarCobranca(req.params.txid);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Webhook
router.post('/webhook', (req, res) => {
  console.log("📩 Pagamento recebido:", req.body);
  res.sendStatus(200);
});

// Pix em massa
router.post('/em-massa', async (req, res) => {
  try {
    const resultado = await enviarPixEmMassa(req.body.pixList);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
