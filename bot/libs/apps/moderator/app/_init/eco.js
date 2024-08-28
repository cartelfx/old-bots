const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require('canvas');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const channelId = '1270456383221010473';
const interval = 60000;

module.exports = class Coin extends ICommand {
    constructor(client) {
        super(client, {
            name: 'coin',
            aliases: ['cc', 'cn'],
            usage: 'canfx <code>',
            category: 'developer'
        });
    }

    /**
     * @param {Client} client 
     */
    async load(client) {
        /*
        client.on('ready', () => {
            setInterval(sendMathQuestion, interval);
        })
            */
    }

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
       
    }
}

async function sendMathQuestion() {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return;

    const num1 = Math.floor(Math.random() * 500);
    const num2 = Math.floor(Math.random() * 500);
    const correctAnswer = num1 + num2;
    const answers = generateAnswers(correctAnswer);

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '28px sans-serif';
    context.fillStyle = '#000000';
    context.fillText(`${num1} + ${num2} = ?`, canvas.width / 2.5, canvas.height / 1.8);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'math-question.png' });

    const row = new ActionRowBuilder()
        .addComponents(
            answers.map((answer, index) => 
                new ButtonBuilder()
                    .setCustomId(`answer_${index}`)
                    .setLabel(answer.toString())
                    .setStyle(ButtonStyle.Primary)
            )
        );

    const embed = new EmbedBuilder()
        .setTitle('Matematik Sorusu')
        .description('Aşağıdaki butonlardan doğru cevabı seçin.')
        .setImage('attachment://math-question.png');

    const message = await channel.send({ embeds: [embed], files: [attachment], components: [row] });

    const filter = i => i.customId.startsWith('answer_') && !i.user.bot;
    const collector = message.createMessageComponentCollector({ filter, max: 1, time: 30000 });

    collector.on('collect', async i => {
        if (parseInt(i.customId.split('_')[1]) === answers.indexOf(correctAnswer)) {
            message.delete();
            await i.reply({ content: 'Tebrikler, doğru cevap!' });
        } else {
            await i.reply({ content: 'Maalesef, yanlış cevap.', ephemeral: true });
        }
    });
    collector.on('end', () => {
        message.delete();
    }
    )
}

function generateAnswers(correctAnswer) {
    const answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 4) {
        answers.add(Math.floor(Math.random() * 1000));
    }
    return Array.from(answers).sort(() => Math.random() - 0.5);
}