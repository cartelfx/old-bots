const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class AllMove extends ICommand {
    constructor(client) {
        super(client, {
            name: 'topluçek',
            aliases: ['allmove', 'herkesicek'],
            usage: 'topluçek <#kanal/ID>',
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
        if(!client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });
        }
        
        if(!message.member.voice.channel) {
            message.channel.send({ embeds: [embed.description(`Bir ses kanalında olmadığınızdan işlem yapılamaz.`)] });
            return;
        }
        
        if (message.member.voice.channel.members.size === 1) {
            message.channel.send({ embeds: [embed.description(`Bu ses kanalında sadece siz varsınız. Başka kimse yok.`)] });
            return;
        }

        const ch = message.mentions.channels.first() || args[0];
        const tasinacak = message.guild.channels.cache.get(ch);

        if (!tasinacak || tasinacak.type !== 2) {
            message.channel.send({ embeds: [embed.description(`Geçersiz bir ses kanalı ID'si girdiniz.`)] });
            return;
        }

        message.member.voice.channel.members.forEach(member => {
            if (member.id !== message.member.id) {
                member.voice.setChannel(tasinacak);
            }
        });

        message.channel.send({ embeds: [embed.description(`${message.guild.getemoji(client.reactions.voice)} ${message.guild.getchannel(message.member.voice.channelId)} kanalındaki tüm üyeler ${message.guild.getchannel(tasinacak.id)} kanalına taşındı.`)] });
    }
}