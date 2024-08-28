const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const MuteModel = require('../../../../database/moderator/MuteModel');
const PenaltyModel = require('../../../../database/moderator/PenaltyModel');

module.exports = class UnVoiceMute extends ICommand {
    constructor(client) {
        super(client, {
            name: 'unvmute',
            aliases: ['unv', 'unvm', 'unvoicemute'],
            usage: 'unvmute <@üye/ID>',
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
        if(!client.settings.ChatMuteSorumluları.some(role => message.member.roles.cache.has(role)) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.YönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        let data = await MuteModel.findOne({ userID: mentioned.id, active: true });

        if(!data) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin aktif **chat mute** cezası bulunmuyor.`)] });
        }

        let mutedata = await PenaltyModel.findOne({ userID: mentioned.id, active: true, type: 'Chat Mute'})
       
        if(client.settings.ChatMuteRolü) {
            await mentioned.roles.remove(client.settings.ChatMuteRolü);
        }

        await MuteModel.updateOne(
            { userID: mentioned.id },
            { $set: { active: false } }
        );

        await PenaltyModel.updateOne(
            { number: mutedata.number },
            { $set: { active: false, end: Date.now(), executor: message.member.id } }
        );

        await message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin **chat mute** cezası başarıyla kaldırıldı. \`(Ceza Numarası: #${mutedata.number})\``)] });
    }
};