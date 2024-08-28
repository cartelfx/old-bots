const { Client, Message, PermissionFlagsBits } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class SendChannel extends ICommand {
    constructor(client) {
        super(client, {
            name: 'gönder',
            aliases: ['gonder', 'kanalagönder', 'kanalagonder'],
            usage: 'gönder <@üye/ID>',
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
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında bulunmadığından taşınamadı.`)] });
            return;
        }

        let kanal = message.guild.channels.cache.get(args[1]);
        if(!kanal) {
            message.channel.send({ embeds: [embed.description('Bir kanal belirtmelisin.')]});
            return;
        }
        if(!kanal.isVoiceBased()) {
            message.channel.send({ embeds: [embed.description('Belirttiğin kanalın tipi **ses kanalı** tabanlı olmadığından kişi odaya taşınamadı.')]});
            return;
        }

        if(!kanal.permissionsFor(mentioned.id).has(PermissionFlagsBits.Connect)) {
            message.channel.send({ embeds: [embed.description(`Belirttiğin kanala kişinin giriş yetkisi bulunmadığından kişi odaya çekilemedi.`)]});
            return;
        }

        await mentioned.voice.setChannel(kanal.id)
        message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ${kanal} kanalına taşındı.`)] });
    }
}