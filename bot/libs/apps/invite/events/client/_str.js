const { IEvent } = require('../../../../source/Structures/BaseEvent');
const { Message } = require('discord.js');

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
        // MESSAGE SETUPS
         config = global.config = require('../../../../source/System/config');
         let replys = global.replys = require('../../../../source/System/bases/reply');

         replys = replys.contents.reduce((acc, item) => {
             acc[item.name] = item.content;
             return acc;
         }, {});
         settings = global.settings = _data.server || {};
        // MESSAGE SETUPS
        if (message.author.bot || !message.guild || message.channel.type != 0) return;

        const app = message.client;

        const prefix = app.prefixes.find(p => message.content.startsWith(p));
        if (!prefix) return;

        const embed = global.embed = new Embed().author(message.member.user.username, message.member.user.avatarURL()).timestamp();
    
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        let command = app.commands.get(commandName);
    
        if (!command) {
            command = app.aliases.get(commandName);
        }
    
        if (command) {
                await command.command(app, message, args, embed);
        }
    }
}