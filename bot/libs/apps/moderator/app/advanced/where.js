const { Client, Message, PermissionFlagsBits } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Where extends ICommand {
    constructor(client) {
        super(client, {
            name: 'nerede',
            aliases: ['where', 'nere', 'n'],
            usage: 'nerede <@üye/ID>',
            category: 'others'
        });
    }

    /**
     * @param {Client} client 
     */
    async load(client) {
        client.on('voiceStateUpdate', (oldState, newState) => {
            const userId = newState.id;
            const oldChannelId = oldState.channelId;
            const newChannelId = newState.channelId;

            if (newChannelId && !oldChannelId) {
                client.wheredatas.set(userId, { channelId: newChannelId, joinTime: Date.now() });
            } else if (!newChannelId && oldChannelId) {
                const voiceData = client.wheredatas.get(userId);
                if (voiceData) {
                    client.wheredatas.delete(userId);
                }
            } else if (newChannelId && oldChannelId && newChannelId !== oldChannelId) {
                const voiceData = client.wheredatas.get(userId);
                if (voiceData) {
                    client.wheredatas.set(userId, { channelId: newChannelId, joinTime: Date.now() });
                }
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
       // if(!client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.AltYetkiliRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYetkiliRolleri.some(role => message.member.roles.cache.has(role)) && message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!mentioned) {
            message.channel.send({ embeds: [embed.description(client.replys.member)]});
            return;
        }

        if(!mentioned.voice.channel) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında bulunmadığından kişinin bilgileri bulunamadı.`)] });
            return;
        }

        const voiceData = client.wheredatas.get(mentioned.id);

        if(!voiceData) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin kayıdı bulunamadı.`)] });
            return;
        }

        if (voiceData) {
            const timestamp = Date.now() - voiceData.joinTime;

            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi şu anda **${mentioned.voice.channel}** kanalında, bu kanalda **${duration(timestamp)}** geçirmiş.\n\nMikrofonu: ${mentioned.voice.selfMute ? message.guild.getemoji(client.reactions.mute) : message.guild.getemoji(client.reactions.unmute)}\n\nKulaklığı: ${mentioned.voice.selfDeaf ? message.guild.getemoji(client.reactions.deafen) : message.guild.getemoji(client.reactions.undeafen)}`)] });
        }
    }
}