const { Client, Message, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Banner extends ICommand {
    constructor(client) {
        super(client, {
            name: 'banner',
            aliases: ['bn'],
            usage: 'banner <@üye/ID>',
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
        const mention = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const user = await client.users.fetch(mention.id, { force: true})

        if(!(await user).bannerURL({ size: 4096})) {
            return message.channel.send({ embeds: [embed.description(`Belirtilen kişinin arka plan resmi bulunamadı.`)]});
        }

        const row = new ActionRowBuilder().addComponents(
            button({
                label: 'Resim Adresi',
                style: 'Link',
                url: (await user).bannerURL(),
            })
        )

        await message.channel.send({ content: `${(await user).bannerURL({ size: 4096})}`, components: [row]})
    }
};