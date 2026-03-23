export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox/';

  try {
    const url = new URL(SAAS_URL);
    if (req.query) {
      Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));
    }

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || '',
        'Accept': '*/*'
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const responseData = await response.text();
    console.log(`Repasse: ${req.method} | Status SaaS: ${response.status}`);

    // TRATAMENTO PARA O STATUS 206 OU 200
    // Se for a validação do Facebook (GET), precisamos devolver o challenge puro
    if (req.method === 'GET') {
      // Forçamos o status 200 para o Facebook, mesmo que o SaaS tenha respondido 206
      return res.status(200).send(responseData);
    }

    // Para mensagens (POST)
    return res.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('Erro no repasse:', error);
    return res.status(500).send('Erro Interno');
  }
}
