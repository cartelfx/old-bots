const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Names extends ICommand {
    constructor(client) {
        super(client, {
            name: 'isimler',
            aliases: ['isimlerim', 'names', 'isims'],
            usage: 'isimler <@üye/ID>',
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

        if (!data || !data.names.length) {
            return message.channel.send({ embeds: [embed.description('Bu kullanıcının kayıtları bulunmuyor.')] });
        }

        let names = data.names.sort((a, b) => b.timestamp - a.timestamp);

        names = names.sort(() => Math.random() - 0.5);

        await pages(message, names, embed, 10, (reg, index) => {
            return `${index + 1}. (${reg.type.replace('Erkek', `<@&${client.settings.ErkekRolleri.find(role => role)}>`).replace('Kadın', `<@&${client.settings.KadınRolleri.find(role => role)}>`)}) ${message.guild.members.cache.get(reg.executor) ? message.guild.members.cache.get(reg.executor) : 'Bilinmeyen Kişi.'} ${unix(reg.timestamp)}`;   
        });
    }
}