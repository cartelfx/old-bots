const { Client, Message, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Device extends ICommand {
    constructor(client) {
        super(client, {
            name: 'cihaz',
            aliases: ['device', 'cihazım', 'cihazbilgi'],
            usage: 'cihaz',
            category: 'global'
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
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const presence = mentioned.presence;

        if (!presence || !presence.clientStatus) {
            message.channel.send({ embeds: [embed.description(`${mentioned} şu anda çevrimdışı veya cihaz bilgisi alınamıyor.`)] });
            return;
        }

        const cihazlar = Object.keys(presence.clientStatus)
            .map(device => {
                switch (device) {
                    case 'desktop':
                        return 'Bilgisayar';
                    case 'mobile':
                        return 'Mobil';
                    case 'web':
                        return 'Web';
                    default:
                        return 'Bilinmiyor';
                }
            })

        message.channel.send({ embeds: [embed.description(`${mentioned} kişisi şu anda **${cihazlar.join(', ')}** üzerinden bağlı.`)] });
    }
};