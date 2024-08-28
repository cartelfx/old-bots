const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const AfkModel = require('../../../../database/moderator/AfkModel');

module.exports = class Afk extends ICommand {
    constructor(client) {
        super(client, {
            name: 'afk',
            aliases: ['afk'],
            usage: 'afk [sebep]',
            category: 'global'
        });
    }

    /**
     * @param {Client} client
     */
    async load(client) {
        client.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            const _data = await AfkModel.findOne({ userID: message.author.id });
            if (_data) {
                message.channel.send({ embeds: [embed.description(`${message.member}, AFK modunuz kaldırıldı. ${unix(_data.timestamp)} **${_data.reason}** sebebi ile AFK moduna geçmiştiniz.`)] });
                await AfkModel.deleteOne({ userID: message.author.id });

                await message.member.setNickname(`${message.member.displayName.replace('[AFK] ', '')}`).catch(() => {});
            }

            if (message.mentions.users.size) {
                message.mentions.users.forEach(async (user) => {
                    const afkm = await AfkModel.findOne({ userID: user.id });
                    if (afkm) {
                        message.reply({ embeds: [embed.description(`${message.member} kişisi ${unix(afkm.timestamp)} **${afkm.reason}** sebebi ile AFK moduna geçmiş.`)] });
                    }
                });
            }
        });
    }

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        const reason = args.join(' ') || 'AFK';
        const supheliicerik = /@(everyone|here)|<@&\d+>|https?:\/\/|discord\.gg|www\.|\.com|\.net|\.org|\.io|\.gg|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

        if (supheliicerik.test(reason)) {
            return message.channel.send({ embeds: [embed.description('Bu AFK sebebi ile AFK moduna geçemezsiniz. Lütfen sebebi düzenleyin ve tekrar deneyin.')] });
        }

        await AfkModel.create({
            userID: message.author.id,
            reason,
            timestamp: Date.now()
        });

        await message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(() => {});


        message.channel.send({ embeds: [embed.description(`${message.guild.getemoji(client.reactions.confirm)} ${message.member} **${reason}** sebebiyle AFK moduna geçtiniz.`)] });
    }
};