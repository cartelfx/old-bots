const { Client, Message, ActionRowBuilder, InteractionCollector } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const { exec } = require('child_process');

module.exports = class ManageBots extends ICommand {
    constructor(client) {
        super(client, {
            name: 'managebots',
            aliases: ['botmanager'],
            usage: 'managebots',
            category: 'developer'
        });
    }

    /**
     * @param {Client} client 
     */
    async load(client) {}

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        const bots = client.config.bots;

        const botMenu = new ActionRowBuilder().addComponents(
            menu({
                id: 'select_bot',
                placeholder: 'Sistemde tanımlı olan botlardan birini seçin.',
                options: Object.keys(bots).map(document => ({
                    label: document.charAt(0).toUpperCase() + document.slice(1),
                    value: document,
                    emoji: '1270698109684416533'
                }))
            })
        );

        const actionMenu = new ActionRowBuilder().addComponents(
            menu({
                id: 'select_action',
                placeholder: 'İşlem Seçin',
                options: [
                    { label: 'Yeniden Başlat', value: 'restart', emoji: 'icon' },
                    { label: 'Durdur', value: 'stop', emoji: 'icon' }
                ]
            })
        );

        await message.channel.send({
            components: [botMenu],
            embeds: [embed.description(`${message.guild.name} sunucusunda sistemde kayıtlı olan botlardan birini yönetmek için bir botun seçiniz.`)]
        }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

            let secilen = null;
            
            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'select_bot') {
                    secilen = interaction.values[0];
                    await interaction.update({
                        components: [actionMenu],
                        embeds: [embed.description(`Seçilen ${secilen} isimli botun üzerinde yapılabilecek işlemler için aşağıdaki menüden seçim yapınız.`)]
                    });
                } else if (interaction.customId === 'select_action' && secilen) {
                    const action = interaction.values[0];

                    if (action === 'restart') {
                        exec(`pm2 restart ${secilen}`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                            console.error(`stderr: ${stderr}`);
                        });
                        await interaction.update({
                            embeds: [embed.description(`${secilen} isimli bot yeniden başlatıldı.`)],
                            components: [],
                            ephemeral: true
                        });
                    } else if (action === 'stop') {
                        exec(`pm2 stop ${secilen}`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                            console.error(`stderr: ${stderr}`);
                        });
                        await interaction.update({
                            embeds: [embed.description(`${secilen} isimli bot kapatıldı.`)],
                            components: [],
                            ephemeral: true
                        });
                    }
                }
            });
        });
    }
}