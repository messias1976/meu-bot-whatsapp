const http = require('http');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

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
        // Remove as opções abaixo temporariamente para teste
        /*
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
        */
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

// Adicione logs antes da inicialização
console.log("Iniciando a inicialização do cliente...");

try {
    // 🟢 Inicializa o bot
    console.log("Chamando client.initialize()...");
    client.initialize();
    console.log("client.initialize() foi chamado.");
} catch (error) {
    console.error("Erro ao inicializar o cliente:", error);
}

// 🕐 Função de delay para simular digitação
const delay = ms => new Promise(res => setTimeout(res, ms));

// 🕐 Função para simular digitação
async function simulateTyping(chat, delayTime) {
    try {
        await delay(delayTime);
        await chat.sendStateTyping();
        await delay(delayTime);
    } catch (error) {
        console.error("Erro ao simular digitação:", error);
    }
}

// 🕐 Função para enviar mensagem com delay
async function sendMessageWithDelay(to, message, delayTime) {
    try {
        await delay(delayTime);
        await client.sendMessage(to, message);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
}

// ⚙️ Configurações
const config = {
    initialKeywords: /(Saber Mais|Automação)/i,
    cadastroLink: 'https://forms.gle/r1Kmz4KwCfx3v5468',
    siteLink: 'https://site.com',
    defaultDelay: 3000,
    initialMessage: `Olá! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`,
    responses: {
        '1': {
            messages: [
                'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas',
                'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar',
                `Link para cadastro: ${'https://forms.gle/r1Kmz4KwCfx3v5468'}`
            ]
        },
        '2': {
            messages: [
                '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes',
                `Link para cadastro: ${'https://forms.gle/r1Kmz4KwCfx3v5468'}`
            ]
        },
        '3': {
            messages: [
                'Sorteio de prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos',
                `Link para cadastro: ${'https://forms.gle/r1Kmz4KwCfx3v5468'}`
            ]
        },
        '4': {
            messages: [
                'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato',
                `Link para cadastro: ${'https://forms.gle/r1Kmz4KwCfx3v5468'}`
            ]
        },
        '5': {
            messages: [
                `Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse WhatsApp ou visite nosso site: ${'https://site.com'}`
            ]
        }
    }
};

// 🚀 Funções de tratamento de mensagens
async function handleInitialMessage(msg) {
    try {
        const chat = await msg.getChat();
        await simulateTyping(chat, config.defaultDelay);
        const contact = await msg.getContact();
        const name = contact.pushname ? contact.pushname.split(" ")[0] : 'Cliente';  // Trata casos onde pushname está vazio
        await sendMessageWithDelay(msg.from, `Olá ${name}! ${config.initialMessage}`, config.defaultDelay);
    } catch (error) {
        console.error("Erro ao tratar mensagem inicial:", error);
    }
}

async function handleOptionMessage(msg, option) {
    try {
        const chat = await msg.getChat();
        if (config.responses[option]) {
            for (const message of config.responses[option].messages) {
                await simulateTyping(chat, config.defaultDelay);
                await sendMessageWithDelay(msg.from, message, config.defaultDelay);
            }
        }
    } catch (error) {
        console.error(`Erro ao tratar opção ${option}:`, error);
    }
}

// 📩 Evento de mensagem recebida
client.on('message', async msg => {
    if (!msg.from.endsWith('@c.us')) {
        return; // Ignora mensagens que não são de números de telefone
    }

    if (config.initialKeywords.test(msg.body)) {
        await handleInitialMessage(msg);
    } else if (['1', '2', '3', '4', '5'].includes(msg.body)) {
        await handleOptionMessage(msg, msg.body);
    }
});