const { IEvent } = require('../../../../source/Structures/BaseEvent');
const { Message } = require('discord.js');
const Embed = require('../../../../source/Core/Embed');

module.exports = class MessageCreate extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'messageCreate';
    }

    /**
     * @param {Message} message 
     */
    async event(message) {
        let _data = ServerModel.findOne({ _id: 1});
        if (!_data) return;

        // MESSAGE SETUPS
         config = global.config = require('../../../../source/System/config');
         let replys = global.replys = require('../../../../source/System/bases/reply');

         replys = replys.contents.reduce((acc, item) => {
             acc[item.name] = item.content;
             return acc;
         }, {});

         let reactions = global.reactions = require('../../../../source/System/bases/emojis')
         reactions = reactions.emojis.reduce((acc, emoji) => {
            acc[emoji.name] = emoji.name;
            return acc;
        }, {});

         settings = global.settings = _data.server || {};
        // MESSAGE SETUPS

        if (message.author.bot || !message.guild || message.channel.type != 0) return;

        StatModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, data) => {
            let kanalID = message.channel.parentId || message.channel.id;
            if (!data) {
                let voiceMap = new Map();
                let chatMap = new Map();
                let voiceCameraMap = new Map();
                let voiceStreamingMap = new Map();
                chatMap.set(kanalID, 1);
                let newMember = new StatModel({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    voiceStats: voiceMap,
                    voiceCameraStats: voiceCameraMap,
                    voiceStreamingStats:  voiceStreamingMap,     
                    totalStreamStats: 0,
                    totalCameraStats: 0,
                    totalVoiceStats: 0,
                    allVoice: {},
                    allMessage:{},
                    allVoiceCategory: {},
                    chatStats: chatMap,
                    totalChatStats: 1,
                    lifeVoiceStats: voiceMap,
                    lifeTotalVoiceStats: 0,
                    lifeChatStats: chatMap,
                    lifeTotalChatStats: 1,
                });
                newMember.save() 
                dayupdatestat(message.author.id, message.channel.id)
            } else {
                let lastData = data.chatStats.get(kanalID) || 0;
                let lastLifeData = data.lifeChatStats.get(kanalID) || 0;
                data.totalChatStats++;
                data.lifeTotalChatStats++;
                data.chatStats.set(kanalID, Number(lastData)+1);
                data.lifeChatStats.set(kanalID, Number(lastLifeData)+1);
                data.save();
                dayupdatestat(message.author.id, message.channel.id)
        };
      }); 

        const app = message.client;

        const prefix = app.prefixes.find(p => message.content.startsWith(p));
        if (!prefix) return;

        const embed = global.embed = new Embed().author(message.member.user.username, message.member.user.avatarURL()).timestamp();
    
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmdname = args.shift().toLowerCase();
    
        let command = app.commands.get(cmdname);
    
        if (!command) {
            command = app.aliases.get(cmdname);
        }
    
        if (command) {
                await command.command(app, message, args, embed);
        }
    }
}

async function dayupdatestat (id, channel) {
    let days = await getday(client.guild)
    await StatModel.updateOne({ userID: id, guildID: client.guild }, { $inc: { [`allMessage.${days}.${channel}`]: 1} })
  }