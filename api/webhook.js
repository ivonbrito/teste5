export default function handler(req, res) {
  // O Facebook envia um desafio (challenge) para validar sua URL
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // 'meu_token_123' é uma senha que VOCÊ inventa agora
    if (mode === 'subscribe' && token === 'meuToken123') {
      console.log('Validação concluída com sucesso!');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Token de verificação inválido');
    }
  }

  // Reservado para quando o Facebook enviar dados reais (mensagens, leads, etc)
  if (req.method === 'POST') {
    console.log('Dados recebidos:', req.body);
    return res.status(200).json({ status: 'sucesso' });
  }
}
