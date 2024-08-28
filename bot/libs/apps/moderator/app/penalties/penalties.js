const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const MuteModel = require('../../../../database/moderator/VoiceMuteModel');
const VoiceMuteModel = require('../../../../database/moderator/VoiceMuteModel');
module.exports = class Penalties extends ICommand {
    constructor(client) {
        super(client, {
            name: 'sicil',
            aliases: ['cezalar', 'cezas', 'siciller'],
            usage: 'vmute',
            category: 'moderation'
        });
    }

    /**
     * @param {Client} client 
     */
        async load(client) {
            scan.voicemute();
        }

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        if(!client.settings.BotKomutRolü.some(role => message.member.roles.cache.has(role)) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.YönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

       
    }
};