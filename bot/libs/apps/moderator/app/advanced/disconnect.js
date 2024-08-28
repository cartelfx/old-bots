const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Advantage extends ICommand {
    constructor(client) {
        super(client, {
            name: 'kes',
            aliases: ['çıkar', 'cikar', 'bağlantıkes', 'baglantikes'],
            usage: 'kes <@üye/ID>',
            category: 'others'
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
        if(!client.KayıtSorumluları.some(role => message.member.roles.cache.has(role)) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!mentioned) {
            message.channel.send({ embeds: [embed.description(client.replys.member)]});
            return;
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        if(!mentioned.voice.channel) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında bulunmadığından bağlantı kesilemedi.`)] });
            return;
        }

        await mentioned.voice.kick();
        message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ${message.guild.getchannel(mentioned.voice.channelId)} kanalından bağlantısı kesildi.`)] });
    }
}