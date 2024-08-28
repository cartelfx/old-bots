const { Client, Message, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Avatar extends ICommand {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['av', 'pp'],
            usage: 'avatar <@üye/ID>',
            category: 'global'
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
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const row = new ActionRowBuilder().addComponents(
            button({
                label: 'Resim Adresi',
                style: 'Link',
                url: mentioned.user.avatarURL(),
            })
        )

        await message.channel.send({ content: `${mentioned.user.displayAvatarURL({ size: 4096})}`, components: [row]})
    }
};