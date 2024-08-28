const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const channels = require('../../../../source/System/bases/logs');

module.exports = class ChannelsCreate extends ICommand {
    constructor(client) {
        super(client, {
            name: 'logkur',
            aliases: ['log-create', 'logs-create'],
            usage: 'logkur',
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
            embeds: [embed.description(`Kanallar kuruluyor...`)]
        });

        let category = message.guild.channels.cache.find(c => c.name === 'CARTELFX-LOGS' && c.type === 4);
        let yeniolusturulacaklar = false;

        if (!category) {
            category = await message.guild.channels.create({
                name: 'CARTELFX-LOGS',
                type: 4,
            });
            yeniolusturulacaklar = true;
        }

        const eksikler = channels.logs.filter(log => 
            !message.guild.channels.cache.some(c => c.name === log.name && c.parentId === category.id)
        );

        if (eksikler.length) {
            await eksikler.reduce((promise, log) => {
                return promise.then(() => {
                    return message.guild.channels.create({
                        name: log.name,
                        type: 0,
                        parent: category.id
                    }).then(() => {
                        yeniolusturulacaklar = true;
                    });
                });
            }, Promise.resolve());

            await message.channel.send({
                embeds: [embed.description('Eksik kanallar kuruldu.')]
            });
        } else if (yeniolusturulacaklar) {
            await message.channel.send({
                embeds: [embed.description('Tüm kanallar kuruldu.')]
            });
        } else {
            await message.channel.send({
                embeds: [embed.description('Kanallar zaten kurulmuş.')]
            });
        }
    }
}