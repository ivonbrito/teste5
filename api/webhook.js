export default async function handler(req, res) {
  const SAAS_URL = 'https://system-design-project-0edae.goskip.app/webhook/whatsapp-inbox';

  // 1. Mantém a validação do Facebook ativa
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === 'meutoken123') {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Token inválido');
  }

  // 2. REPASSE DE MENSAGENS (Onde a mágica acontece)
  if (req.method === 'POST') {
    try {
      // Enviando o que recebeu do Facebook direto para o seu SaaS
      const response = await fetch(SAAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Repassamos os headers de segurança caso o SaaS exija
          'X-Hub-Signature-256': req.headers['x-hub-signature-256'] 
        },
        body: JSON.stringify(req.body)
      });

      console.log('Repasse para o SaaS concluído. Status:', response.status);
      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Erro ao repassar para o SaaS:', error);
      return res.status(500).send('Erro no repasse');
    }
  }
}
