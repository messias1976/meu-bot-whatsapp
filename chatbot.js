const http = require('http');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuração do servidor HTTP (keep-alive)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive!');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Keep-alive server listening on port ${port}`);
});

// Caminho para o arquivo de sessão
const SESSION_FILE_PATH = './session.json';

// Inicializa o cliente whatsapp-web.js com LocalAuth
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'gera-digital-bot' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
    }
});

// Gera o QR code no terminal (apenas para a primeira conexão)
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Evento de autenticação (salva a sessão)
client.on('authenticated', (session) => {
    console.log('Autenticado! Salvando sessão...');
});

// Evento de sessão salva
client.on('session', (session) => {
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

// Evento de inicialização
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Evento de falha de autenticação
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// Inicializa o cliente
client.initialize();

// Função de delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Evento de mensagem
client.on('message', async msg => {
        console.log("Mensagem recebida:", msg.body); // Adicione esta linha
    if (msg.body.match(/(Quero saber mais|trabalha com automação|Voçês fazem automação?| Automação)/i) && msg.from.endsWith('@c.us')) {
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