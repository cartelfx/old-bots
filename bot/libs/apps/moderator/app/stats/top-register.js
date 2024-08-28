const { Client, Message, MessageEmbed, bold, italic } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class TopRegister extends ICommand {
    constructor(client) {
        super(client, {
            name: 'top-register',
            aliases: ['topregister', 'topreg', 'topkayıt', 'topkayit'],
            usage: 'top-register',
            category: 'confirmed'
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
     * @param {MessageEmbed} embed
     */
    async command(client, message, args, embed) {
        let member = message.member;


        let users = await UserModel.find({ 'registrations.0': { $exists: true } })
            .sort({ 'registrations.length': -1 })
            .limit(30);

        if (!users.length) {
            return message.channel.send({ embeds: [embed.description('Kayıt sıralaması bulunamadı.')] });
        }

        let userIndex = users.findIndex(user => user.userID === member.id) + 1;
        if (userIndex === 0) userIndex = 'Bu kullanıcı listede bulunmuyor.';

        await pages(message, users, embed, 30, (user, index) => {
            return `${bold(message.guild.name)} sunucusunun Top 30 **Register** sıralaması aşağıda belirtilmiştir.
            
${index + 1}. ${message.guild.members.cache.get(user.userID) || 'Bilinmeyen Üye'} toplam kayıt ${bold(user.registrations.length)} (**${user.registrations.filter(r => r.type === 'Erkek').length} erkek** **${user.registrations.filter(r => r.type === 'Kadın').length} kadın**)

Siz ${userIndex} sırada bulunuyorsunuz.
`;
});
    }
};