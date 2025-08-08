const axios = require('axios');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const agent = new https.Agent({
  pfx: fs.readFileSync(process.env.CERT_PATH),
  passphrase: process.env.CERT_PASS
});

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
  const { data } = await axios.post(`${process.env.BASE_URL}/oauth/token`, 
    'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    httpsAgent: agent
  });
  return data.access_token;
}

async function gerarCobranca(dados) {
  const token = await getAccessToken();
  const { data } = await axios.post(`${process.env.BASE_URL}/v2/cob`, {
    calendario: { expiracao: 3600 },
    devedor: {
      cpf: dados.cpf,
      nome: dados.nome
    },
    valor: { original: dados.valor },
    chave: dados.chave,
    solicitacaoPagador: "Pagamento referente ao pedido X"
  }, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent: agent
  });
  return data;
}

async function gerarQRCode(locId) {
  const token = await getAccessToken();
  const { data } = await axios.get(`${process.env.BASE_URL}/v2/loc/${locId}/qrcode`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent: agent
  });
  return data;
}

async function consultarCobranca(txid) {
  const token = await getAccessToken();
  const { data } = await axios.get(`${process.env.BASE_URL}/v2/cob/${txid}`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent: agent
  });
  return data;
}

async function enviarPixEmMassa(listaPix) {
  const token = await getAccessToken();
  const results = [];

  for (const pix of listaPix) {
    const res = await axios.post(`${process.env.BASE_URL}/v2/pix`, {
      valor: pix.valor,
      chave: pix.chave,
      pagador: pix.pagador,
      descricao: pix.descricao
    }, {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent: agent
    });
    results.push(res.data);
  }

  return results;
}

module.exports = { gerarCobranca, gerarQRCode, consultarCobranca, enviarPixEmMassa };
