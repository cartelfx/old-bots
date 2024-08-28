const { Client, Message, bold, italic } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const UserModel = require('../../../../database/moderator/UserModel');

module.exports = class Confirmations extends ICommand {
    constructor(client) {
        super(client, {
            name: 'kayıtlarım',
            aliases: ['teyitlerim', 'teyits', 'kayitlarim'],
            usage: 'kayıtlarım',
            category: 'confirmed'
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
        if(!client.settings.KayıtSorumluları.some(role =>message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let data = await UserModel.findOne({ userID: mentioned.id });

        if (!data || !data.registrations.length) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin veritabanında kayıdı bulunamadı.`)] });
        }

        const bazilari = data.registrations.slice(0, 3).map(reg => `<@${reg.member}>`);

        await message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin kayıt ettiği kullanıcı sayısı: ${data.registrations.length} ${bold('toplam')} 
(${data.registrations.filter(reg => reg.type === 'Kadın').length} ${italic('kadın')}, ${data.registrations.filter(reg => reg.type === 'Erkek').length} ${italic('erkek')}), kaydettiği bazı kişiler: ${bazilari.length ? bazilari.join(',') : 'Bulunamadı.'}
`)] });
    }
}