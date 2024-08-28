const { IEvent } = require('../../../../source/Structures/BaseEvent');
const { Message } = require('discord.js');
const Embed = require('../../../../source/Core/Embed');

module.exports = class MessageUpdate extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'messageUpdate';
    }

    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage
     */
    async event(oldMessage, newMessage) {
        if(newMessage.author.bot) return;

        let loggetir = newMessage.guild.getchannel('message-log')
        if(loggetir) loggetir.send({
            embeds: [
                new Embed().author(newMessage.member.user.username, newMessage.member.user.avatarURL()).timestamp().description(`${newMessage.guild.getemoji(client.reactions.chat)} ${newMessage.author} kişisinin ${unix(Date.now())} ${loggetir} kanalında düzenlediği mesajın içeriği aşağıda belirtilmiştir.
    
${newMessage.guild.getemoji(client.reactions.icon)} Düzenleyen Kullanıcı: ${newMessage.author} (\`${newMessage.author.id}\`)
${newMessage.guild.getemoji(client.reactions.icon)} Düzenlenmeden Önceki Mesajın İçeriği: **${oldMessage.content}** (\`${oldMessage.id}\`)
${newMessage.guild.getemoji(client.reactions.icon)} Düzenlendikten Sonraki Mesajın İçeriği: **${newMessage.content}** (\`${newMessage.id}\`)
${newMessage.guild.getemoji(client.reactions.icon)} Düzenlenen Kanal: ${newMessage.channel} (\`${newMessage.channel.id}\`)
${newMessage.guild.getemoji(client.reactions.icon)} Düzenlenen Tarih: ${history(Date.now())} (${unix(Date.now())})`)
            ]
        })
    }
}