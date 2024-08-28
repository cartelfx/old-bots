const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Eval extends ICommand {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: ['ev', 'c'],
            usage: 'eval <code>',
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
        if(client.rooters.includes(message.author.id));
        if (!args[0] || args[0].includes("token")) {
            return message.delete();
        }

        const code = args.join(" ");

            var evaled = clean(await eval(code));

            Object.values(config.bots).map(bot => bot.token).forEach(token => {
                if (evaled.includes(token)) {
                    evaled = evaled.replace(new RegExp(token, 'g'), "benle baş etmek için ilk önce egomu yenmelisiniz!");
                }
            });

            message.channel.send({
                content: `\`\`\`js
                ${evaled}\`\`\``
            });

        function clean(text) {
            if (typeof text !== "string")
                text = require("util").inspect(text, { depth: 0 });
            text = text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
            return text;
        }
    }
}