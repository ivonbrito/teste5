export default async function handler(req, res) {
  // 1. Definição da URL de destino (SaaS)
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox';

  try {
    // 2. Uso da API WHATWG (Recomendada pelo log de erro)
    const targetUrl = new URL(SAAS_URL);
    
    // 3. Repasse manual de parâmetros para evitar funções legadas
    const searchParams = new URLSearchParams(req.query);
    targetUrl.search = searchParams.toString();

    // 4. Execução do repasse (Proxy)
    const response = await fetch(targetUrl.href, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': req.headers['x-hub-signature-256'] || '',
        'Accept': '*/*'
      },
      // Corpo apenas para POST (mensagens reais)
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const responseData = await response.text();
    
    // Log detalhado para você ver na Vercel o que está acontecendo
    console.log(`[${req.method}] Repasse para SaaS | Status: ${response.status}`);

    // 5. Resposta para o Facebook (Sempre forçamos 200 para validar)
    if (req.method === 'GET') {
      return res.status(200).send(responseData);
    }

    return res.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('Erro no Proxy:', error.message);
    return res.status(500).send('Erro de Conexão');
  }
}
