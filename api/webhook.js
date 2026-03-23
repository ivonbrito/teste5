export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox';

  // Criar a URL de repasse mantendo os parâmetros (hub.challenge, etc)
  const targetUrl = new URL(SAAS_URL);
  Object.keys(req.query).forEach(key => targetUrl.searchParams.append(key, req.query[key]));

  try {
    const response = await fetch(targetUrl.toString(), {
      method: req.method, // Repassa exatamente o que vier (GET ou POST)
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || ''
      },
      // Só envia body se for POST
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const responseData = await response.text();
    console.log(`Repasse [${req.method}] para SaaS. Status: ${response.status}`);

    // Se o Facebook estiver validando (GET), precisamos devolver o challenge que o SAAS retornou
    if (req.method === 'GET') {
      return res.status(response.status).send(responseData);
    }

    // Para mensagens (POST), confirmamos o recebimento para o Facebook
    return res.status(200).send('EVENT_RECEIVED');
    
  } catch (error) {
    console.error('Erro no repasse:', error);
    return res.status(500).send('Erro interno no servidor');
  }
}
