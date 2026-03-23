export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox/';

  try {
    const url = new URL(SAAS_URL);
    
    // Repassa apenas os parâmetros de validação (hub.mode, hub.challenge, etc)
    if (req.query) {
      Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));
    }

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || '',
        'Accept': '*/*'
      }
    };

    // Só inclui o corpo se for um evento de mensagem (POST)
    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), options);
    const responseData = await response.text();
    
    console.log(`Minimal Proxy: ${req.method} | SaaS Status: ${response.status}`);

    // Devolve para o Facebook exatamente o que o SaaS respondeu
    return res.status(response.status).send(responseData);

  } catch (error) {
    console.error('Erro no repasse minimalista:', error);
    return res.status(500).send('Erro Interno');
  }
}
