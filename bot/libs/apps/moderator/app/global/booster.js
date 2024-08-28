const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Booster extends ICommand {
    constructor(client) {
        super(client, {
            name: 'booster',
            aliases: ['zengin', 'b', 'zeng'],
            usage: 'booster <isim>',
            category: 'global'
        });

        this.daataatattata = new Map();
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
        if (!message.member.roles.cache.has(client.settings.BoosterRolü) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) 
            return message.channel.send({ embeds: [embed.description(`Sunucuya takviye basmadığınızdan dolayı bu işlemi gerçekleştiremezsiniz.`)] });
        
        let name = args.join(" ");
        if (!name) 
            return message.channel.send({ embeds: [embed.description(`İsmini değiştirmek için bir isim belirtmelisin!`)] });
        
        if (/([^a-zA-ZIıİiÜüĞğŞşÖöÇç0-9 ]+)/gi.test(name)) 
            return message.channel.send({ embeds: [embed.description(`Değiştirmek istediğiniz isimde özel karakter bulunamaz.`)] });

        let userData = this.daataatattata.get(message.author.id) || { count: 0, lastTimestamp: 0 };

        if (Date.now() - userData.lastTimestamp < 3600000 && userData.count >= 3)
            return message.channel.send({ embeds: [embed.description(`Saatte en fazla 3 kez isminizi değiştirebilirsiniz.`)] });
        
        let nameeecik = message.member.nickname.replace(client.settings.UnTag, "").replace(client.settings.ServerTag, "").replace(" ", "").split(" | ")[0]
          message.member.setNickname(message.member.displayName.replace(nameeecik, name)).catch(err => {})

        userData.count = (Date.now() - userData.lastTimestamp < 3600000) ? userData.count + 1 : 1;
        userData.lastTimestamp = Date.now();
        this.daataatattata.set(message.author.id, userData);

        return message.channel.send({ embeds: [embed.description(`Başarıyla isminiz "${name}" olarak değiştirildi!`)] });
    }
};