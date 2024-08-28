const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const emojis = require('../../../../source/System/bases/emojis');

module.exports = class EmojisCreate extends ICommand {
    constructor(client) {
        super(client, {
            name: 'emojikur',
            aliases: ['emojis-create', 'emoji-create'],
            usage: 'emojikur',
            category: 'developer'
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
        await message.channel.send({
            embeds: [embed.description('Emojiler kuruluyor...')]
        });

        emojis.emojis.reduce((promise, emoji) => {
            return promise.then(() => {
                if (!message.guild.emojis.cache.some(e => e.name === emoji.name)) {
                    return message.guild.emojis.create({ attachment: emoji.value, name: emoji.name });
                }
            });
        }, Promise.resolve());

        await message.channel.send({
            embeds: [embed.description('Tüm emojiler kuruldu.')]
        });
    }
}