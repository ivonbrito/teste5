export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox/';

  try {
    // 1. Construção da URL usando a API WHATWG (evita o DeprecationWarning)
    const targetUrl = new URL(SAAS_URL);
    
    // 2. Repassa os parâmetros da query (hub.challenge, etc)
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        targetUrl.searchParams.append(key, value);
      }
    }

    // 3. Executa o repasse
    const response = await fetch(targetUrl.href, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || '',
        'Accept': 'application/json, text/plain, */*'
      },
      // Corpo da mensagem apenas para POST
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const responseData = await response.text();
    
    // Log para diagnóstico no painel da Vercel
    console.log(`Log: ${req.method} | Destino: ${targetUrl.pathname} | Status SaaS: ${response.status}`);

    // 4. Resposta para o Facebook
    // Independentemente do 206 ou 200 do SaaS, entregamos 200 para o Facebook validar
    if (req.method === 'GET') {
      return res.status(200).send(responseData);
    }

    return res.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('Erro no Proxy:', error.message);
    return res.status(500).send('Erro de Conexão');
  }
}
