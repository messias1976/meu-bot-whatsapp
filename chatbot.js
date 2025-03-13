const http = require('http');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, Buttons, List, MessageMedia } = require('whatsapp-web.js');

// 🟢 Servidor HTTP para manter o bot ativo no Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive!');
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => console.log(`✅ Keep-alive server rodando na porta ${port}`));

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
    if (msg.body.match(/(Saber Mais|Automação)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname.split(" ")[0];

        await client.sendMessage(msg.from, `Olá ${name}! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`);
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(5000); // Delay de 5 segundos
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos');

        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar');

        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes');

        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Sorteio de prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos');
        
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato');

        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simulando digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse WhatsApp ou visite nosso site: https://site.com');
    }
});
