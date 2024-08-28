const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Delete extends ICommand {
    constructor(client) {
        super(client, {
            name: 'sil',
            aliases: ['delete', 'temizle'],
            usage: 'sil <adet>',
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

        const silinecek = args[0];

        if (!silinecek) {
            message.channel.send({
                embeds: [embed.description('Lütfen silinecek mesaj sayısını belirtin.')]
            });
            return;
        }

        if (isNaN(silinecek) || Number(silinecek) < 1 || Number(silinecek) > 99) {
            message.channel.send({
                embeds: [embed.description('Lütfen 1 ile 99 arasında geçerli bir sayı belirtin.')]
            });
            return;
        }

        message.channel.bulkDelete(Number(silinecek), true)
            .then(deletedMessages => {
                message.channel.send({
                    embeds: [embed.description(`${deletedMessages.size} mesaj başarıyla silindi.`)]
                }).then(acer => {
                    setTimeout(() => acer.delete(), 5000);
                });
            })
    }
}