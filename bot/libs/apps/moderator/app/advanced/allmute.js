const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class AllMute extends ICommand {
    constructor(client) {
        super(client, {
            name: 'toplusustur',
            aliases: ['allmute', 'herkesisustur', 'tsustur'],
            usage: 'toplusustur',
            category: 'others'
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
        if(!client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] }); 
        if(!message.member.voice.channel) {
            message.channel.send({ embeds: [embed.description(`Bir ses kanalında olmadığınızdan susturma işlemi yapılamaz.`)] });
            return;
        }
        
        if(!args[0]) {
        if (message.member.voice.channel.members.size === 1) {
            message.channel.send({ embeds: [embed.description(`Bu ses kanalında sadece siz varsınız. Susturulacak başka kimse yok.`)] });
            return;
        }
        
        if(message.member.voice.channel.members.filter(member => member.id !== message.member.id).every(member => member.voice.serverMute)) {
            message.channel.send({ embeds: [embed.description(`Ses kanalında sizin haricinizde herkes susturulmuş.`)] });
            return;
        }
        
        message.member.voice.channel.members.forEach(member => {
            if (member.id !== message.member.id) {
                member.voice.setMute(true);
            }
        });
        
        message.channel.send({ embeds: [embed.description(`${message.guild.getemoji(client.reactions.mute)} ${message.guild.getchannel(message.member.voice.channelId)} kanalındaki tüm  üyeler susturuldu.`)] });
        }

        if(args[0] === 'aç') {
            if (message.member.voice.channel.members.size === 1) {
                message.channel.send({ embeds: [embed.description(`Bu ses kanalında sadece siz varsınız. Susturulacak başka kimse yok.`)] });
                return;
            }
            
            if(message.member.voice.channel.members.filter(member => member.id !== message.member.id).every(member => !member.voice.serverMute)) {
                message.channel.send({ embeds: [embed.description(`Ses kanalında susturulan kimse bulunmuyor.`)] });
                return;
            }
            
            message.member.voice.channel.members.forEach(member => {
                if (member.id !== message.member.id) {
                    member.voice.setMute(false);
                }
            });
            
            message.channel.send({ embeds: [embed.description(`${message.guild.getemoji(client.reactions.unmute)} ${message.guild.getchannel(message.member.voice.channelId)} kanalındaki tüm üyelerin susturmasık kaldırıldı.`)] });
        }
    }
}