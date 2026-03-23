export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox/';

  try {
    // Usando a API moderna para evitar o aviso de Deprecation
    const url = new URL(SAAS_URL);
    
    // Repassa os parâmetros do Facebook (hub.challenge, etc)
    if (req.query) {
      Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));
    }

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || '',
        'User-Agent': 'Vercel-Webhook-Proxy/1.0'
      },
      // Só envia corpo se não for GET
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const responseData = await response.text();
    
    console.log(`Encaminhado: ${req.method} | Status SaaS: ${response.status}`);
    
    // IMPORTANTE: Retornamos ao Facebook exatamente o que o SaaS respondeu
    return res.status(response.status).send(responseData);

  } catch (error) {
    console.error('Erro crítico no repasse:', error);
    return res.status(500).send('Erro interno no servidor de máscara');
  }
}
