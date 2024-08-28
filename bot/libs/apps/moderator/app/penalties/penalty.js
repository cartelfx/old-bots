const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const PenaltyModel = require('../../../../database/moderator/PenaltyModel');

module.exports = class Penalty extends ICommand {
    constructor(client) {
        super(client, {
            name: 'ceza',
            aliases: ['puni', 'cezasorgu', 'cezano', 'cezabilgi'],
            usage: 'ceza <#ID>',
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
        if (!client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) &&  !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) &&  !client.settings.YönetimRolleri.some(role => message.member.roles.cache.has(role)) &&  !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });
        }

        const no = args[0];
        if (!no) {
            return message.channel.send({ embeds: [embed.description('Bir ceza numarası belirtmelisin.')] });
        }

        if (isNaN(no)) {
            return message.channel.send({ embeds: [embed.description('Geçerli bir ceza numarası belirtmelisin.')] });
        }

        const res = await PenaltyModel.findOne({ number: no });
        if (!res) {
            return message.channel.send({ embeds: [embed.description('Belirtilen ceza numarasına ait kayıt bulunamadı.')] });
        }
        
        const _user = (await message.guild.members.fetch(res.userID)).user
        const _executor = (await message.guild.members.fetch(res.executor)).user

        message.channel.send({
            embeds: [embed.description(`${_user} (\`${_user.id}\`) kişisine uygulanan **${no}** numaralı ceza bilgisi;`)
                .addFields([{ name: 'Ceza Türü', value: `**${res.type}**` }])
                .addFields([{ name: 'Cezayı Uygulayan Yetkili', value: `${_executor} (\`${_executor.id}\`)` }])
                .addFields([{ name: 'Ceza Sebebi', value: `**${res.reason}**` }])
                .addFields([{ name: 'Ceza Başlangıç Tarihi', value: history(res.timestamp) }])
                .addFields([{ name: 'Ceza Bitiş Tarihi', value: `${history(res.end ? res.end : 'Süresiz')}` }])
                .addFields([{ name: 'Ceza Durumu', value: res.active ? 'Aktif' : 'Pasif' }])
                .addFields([{ name: 'Ceza Raporu', value: res.report ? res.report : 'Eklenmemiş.' }])
            ]
        });
    }
};