const http = require('http');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 🟢 Servidor HTTP para manter o bot ativo no Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive!');
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`✅ Keep-alive server rodando na porta ${port}`));

// 🟢 Inicializa o cliente WhatsApp com LocalAuth
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "gera-digital-bot" // Isso permite múltiplas instâncias se necessário
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// 🟢 Gera QR Code no terminal para login
client.on('qr', qr => {
    console.log('🔵 Escaneie o QR Code abaixo para conectar:');
    qrcode.generate(qr, { small: true });
});

// 🟢 Evento de autenticação bem-sucedida
client.on('authenticated', () => {
    console.log('✅ Autenticado com sucesso!');
});

// 🟢 Evento quando o bot está pronto para uso
client.on('ready', () => {
    console.log('🤖 Bot conectado e pronto para uso!');
});

// 🛑 Evento de falha na autenticação
client.on('auth_failure', msg => {
    console.error('❌ Falha na autenticação:', msg);
});

// 🛑 Evento de desconexão do cliente
client.on('disconnected', reason => {
    console.warn('⚠️ Cliente desconectado:', reason);
});

// 🟢 Inicializa o bot
client.initialize();

// 🕐 Função de delay para simular digitação
const delay = ms => new Promise(res => setTimeout(res, ms));

// 📩 Evento de mensagem recebida
client.on('message', async msg => {
    console.log("📩 Mensagem recebida:", msg.body);

    if (msg.body.match(/(Quero saber mais|trabalha com automação|Vocês fazem automação| Automação)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);
        const contact = await msg.getContact();
        const name = contact.pushname.split(" ")[0];

        await client.sendMessage(msg.from, `Olá ${name}! Sou o assistente virtual da Gera Digital. 

Ajudamos empresas a automatizar o WhatsApp para aumentar vendas e melhorar o atendimento.

Escolha uma opção:

1️⃣ Como funciona a automação?
2️⃣ Benefícios da automação
3️⃣ Quero me cadastrar para uma consultoria gratuita`);
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        await delay(2000);
        await client.sendMessage(msg.from, `📌 *Como funciona a automação do WhatsApp?*

- Criamos um bot personalizado para o seu negócio.
- Ele responde clientes automaticamente.
- Agenda reuniões e organiza seu atendimento.
- Converte mais leads sem esforço manual.

💡 Escolha outra opção:
2️⃣ Benefícios da automação
3️⃣ Quero me cadastrar para uma consultoria gratuita
0️⃣ Voltar ao menu principal`);
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        await delay(2000);
        await client.sendMessage(msg.from, `🚀 *Benefícios da automação do WhatsApp:*

✔ Atendimento 24/7 sem precisar de equipe o tempo todo.
✔ Captação automática de leads qualificados.
✔ Respostas rápidas e personalizadas para clientes.
✔ Integração com CRM e outros sistemas.

💡 Escolha outra opção:
1️⃣ Como funciona a automação?
3️⃣ Quero me cadastrar para uma consultoria gratuita
0️⃣ Voltar ao menu principal`);
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        await delay(2000);
        await client.sendMessage(msg.from, `📝 *Cadastro para consultoria gratuita!* 

Aproveite uma análise gratuita do seu negócio para entender como a automação pode te ajudar.

🔹 Preencha o formulário: [https://forms.gle/9yzQj4RzT2vGjQwu6]

💡 Escolha outra opção:
1️⃣ Como funciona a automação?
2️⃣ Benefícios da automação
0️⃣ Voltar ao menu principal`);
    }

    if (msg.body === '0' && msg.from.endsWith('@c.us')) {
        await delay(2000);
        await client.sendMessage(msg.from, `🔄 Voltando ao menu principal...

1️⃣ Como funciona a automação?
2️⃣ Benefícios da automação
3️⃣ Quero me cadastrar para uma consultoria gratuita`);
    }
});
