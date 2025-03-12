const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
    if (msg.body.match(/(Quero saber mais|trabalha com automação)/i) && msg.from.endsWith('@c.us')) {
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
