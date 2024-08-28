const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const SnipeModel = require('../../../../database/moderator/SnipeModel');

module.exports = class Snipe extends ICommand {
    constructor(client) {
        super(client, {
            name: 'snipe',
            aliases: ['snip', 'sonmesaj', 'sonmesajlar'],
            usage: 'snipe',
            category: 'others'
        });
    }

    /**
     * @param {Client} client 
     */
        async load(client) {
            client.on('messageDelete', async (message) => {
               if(message.partial) return;
               if(message.author.bot) return;

                const content = message.content || null;
                const attachment = message.attachments.size > 0 ? message.attachments.first().url : null;

                await SnipeModel.deleteMany();

                await SnipeModel.create({
                    userID: message.author.id,
                    channelID: message.channel.id,
                    attachment: attachment,
                    content: content,
                    timestamp: Date.now()
                })
            })
        }

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        if(!client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        const snipe = await SnipeModel.findOne({ channelID: message.channel.id }).sort({ timestamp: -1 });
        if(!snipe) {
            await message.react('🚫')
            return;
        }

       const anorasnipe = embed.description(`${message.guild.getemoji(client.reactions.chat)} ${message.channel} kanalında ${unix(snipe.timestamp)} silinmiş mesajın içeriği aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.icon)} Mesajı Silen Kişi: ${snipe.userID ? `${(await client.users.fetch(snipe.userID))} (${(await client.users.fetch(snipe.userID)).id})` : 'Kişi bulunamadı.'}
${message.guild.getemoji(client.reactions.icon)} Silinen Mesajın İçeriği: \`${snipe.content ? snipe.content : 'İçerik bulunamadı.'}\`
${message.guild.getemoji(client.reactions.icon)} Silinme Tarihi: ${history(snipe.timestamp)} (${unix(snipe.timestamp)})
`)

    if(snipe.attachment) {
        anorasnipe.setImage(snipe.attachment)
    }

    await message.channel.send({ embeds: [anorasnipe] });
       
    }
}