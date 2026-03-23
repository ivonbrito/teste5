export default async function handler(req, res) {
  // AJUSTE: Adicionada a barra '/' no final para evitar o erro 405 Method Not Allowed
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox/';

  try {
    const url = new URL(SAAS_URL);
    
    // Repassa os parâmetros de query (importante para a validação do Facebook)
    if (req.query) {
      Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));
    }

    // Configuração do repasse
    const options = {
      method: req.method,
      headers: {
        ...req.headers, // Repassa todos os headers originais (incluindo a assinatura X-Hub)
        'host': url.hostname, // Ajusta o host para o destino final
      }
    };

    // Só inclui o corpo da requisição se não for um GET
    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), options);
    const responseData = await response.text();
    
    // Log para você acompanhar no painel da Vercel
    console.log(`Encaminhado: ${req.method} | Status do SaaS: ${response.status}`);

    // Retorna para o Facebook exatamente o que o SaaS respondeu
    // Se for a validação (GET), o Facebook precisa receber o 'hub.challenge' que o SaaS ecoar
    return res.status(response.status).send(responseData);

  } catch (error) {
    console.error('Erro no proxy de webhook:', error);
    return res.status(500).send('Erro interno no servidor de máscara');
  }
}
