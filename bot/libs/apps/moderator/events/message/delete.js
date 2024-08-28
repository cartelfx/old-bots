const { IEvent } = require('../../../../source/Structures/BaseEvent');
const { Message } = require('discord.js');
const Embed = require('../../../../source/Core/Embed');

module.exports = class MessageDelete extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'messageDelete';
    }

    /**
     * @param {Message} message 
     */
    async event(message) {
        if(message.author.bot) return;

        let loggetir = message.guild.getchannel('message-log')
        if(loggetir) loggetir.send({
            embeds: [
                new Embed().author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.chat)} ${message.author} kişisi ${unix(Date.now())} ${loggetir} kanalında kaldırdığı mesajın içeriği aşağıda belirtilmiştir.
    
${message.guild.getemoji(client.reactions.icon)} Silen Kullanıcı: ${message.author} (\`${message.author.id}\`)
${message.guild.getemoji(client.reactions.icon)} Silinen Mesajın İçeriği: **${message.content}** (\`${message.id}\`)
${message.guild.getemoji(client.reactions.icon)} Silinen Kanal: ${message.channel} (\`${message.channel.id}\`)
${message.guild.getemoji(client.reactions.icon)} Silinen Tarih: ${history(Date.now())} (${unix(Date.now())})`)
            ]
        })
    }
}