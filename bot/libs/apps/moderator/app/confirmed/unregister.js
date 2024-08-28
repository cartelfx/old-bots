const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Unregister extends ICommand {
    constructor(client) {
        super(client, {
            name: 'unregister',
            aliases: ['unreg', 'kayıtsız', 'kayitsiz'],
            usage: 'unregister <@üye/ID>',
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

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        if(client.settings.KayıtsızRolleri.some(role => mentioned.roles.cache.has(role))) {
            message.channel.send({ embeds: [
                embed.description(
                    `${mentioned} kişisi zaten **kayıtsız** durumunda olduğundan yeniden kayıtsız'a atılamaz.` 
                )
            ]});
            return
        }

        mentioned.setNickname(`${mentioned.user.username.includes(client.settings.ServerTag) ? client.settings.ServerTag : client.settings.UnTag} İsim | Yaş`);

        message.channel.send({ 
            embeds: [
                embed.description(
                    `${mentioned} kişisine ${message.guild.roles.cache.get(client.settings.KayıtsızRolleri[0])} rolü verildi.`
                )
            ]
        });

        await UserModel.updateOne(
            { userID: mentioned.id },
            { $push: { names: { 
                name: `İsim | Yaş`,
                type: 'Kayıtsıza atılma',
                executor: message.member.id,
                timestamp: Date.now()
            } } },
            { upsert: true },
        );
    }
}