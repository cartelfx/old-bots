const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const PenaltyModel = require('../../../../database/moderator/PenaltyModel');

module.exports = class Ban extends ICommand {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['sg', 'acer', 'banla'],
            usage: 'ban <@üye/ID>',
            category: 'moderation'
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
        if (!client.rooters.includes(message.member.id) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role))) {
            return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });
        }

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        let datacik = await PenaltyModel.findOne({ userID: mentioned.id, active: true, type: 'Underworld'})
        if (datacik) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin aktif bir underworld cezası bulunuyor.`)] });
        }

        if(message.member.roles.cache.has(client.settings.BotKomutRolü)) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisi yetkili olduğundan **ban işlemi** uygulanamaz.`)] });
        }

        const reason = args.slice(1).join(' ') || 'Belirlenmedi';

        penalties.underworld(mentioned, message.author, reason, message);
    }
};