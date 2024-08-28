const { Client, Message } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Name extends ICommand {
    constructor(client) {
        super(client, {
            name: 'isim',
            aliases: ['name', 'i', 'nick'],
            usage: 'isim <@üye/ID> <isim> <yaş>',
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
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        if(!client.settings.KayıtSorumluları.some(role =>message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
             message.channel.send({ embeds: [embed.description(client.replys.member)] });
             return;
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        let rawName = args[1];
        let age = args[2];

        if(!rawName) {
            return message.channel.send({ embeds: [embed.description(`Bir isim belirtmelisin!`)] });
        }

        if(!age) {
            return message.channel.send({ embeds: [embed.description(`Bir yaş belirtmelisin!`)] });
        }
        if (isNaN(age)) {
            return message.channel.send({ embeds: [embed.description('Geçerli bir yaş belirtmelisin!')] });
        }

        age = parseInt(age);

        if (age < settings.YaşLimit) {
            return message.channel.send({ embeds: [embed.description(client.replys.age)] });
        }

        if (age > 99) {
            return message.channel.send({ embeds: [embed.description(client.replys.ageapi)] });
        }

        let nameAge = rawName.split(' ').map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join(' ');

        mentioned.setNickname(`${mentioned.user.username.includes(client.settings.ServerTag) ? client.settings.ServerTag : client.settings.UnTag} ${rawName.split(' ').map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join(' ')} | ${age}`);

        let nameData = await UserModel.findOne({ userID: mentioned.id });

        message.channel.send({ embeds: [
            embed.description(
                `${(nameData?.names?.length ? `
${mentioned} kişisinin ismi başarıyla "${nameAge} | ${age}" ismine değiştirildi. Bu kişi daha önce şu isimlerle kayıt olmuş:\n
Kişinin Toplamda ${nameData.names.length} isim kayıtı bulundu.
${nameData.names.map(x => `\`• ${x.name}\` (${x.type.replace('Erkek', `<@&${client.settings.ErkekRolleri.find(role => role)}>`).replace('Kadın', `<@&${client.settings.KadınRolleri.find(role => role)}>`)}) ${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor) : 'Bilinmeyen Kişi.'} ${unix(x.timestamp)}`).slice(0, 10).join("\n ")}\n
Kişinin önceki isimlerine \`${config.bot_options.prefixes[0]}isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.` 
                : `${mentioned} kişisinin ismi başarıyla "${nameAge} | ${age}" ismine değiştirildi.`)}` 
            )
        ]});

        await UserModel.updateOne(
            { userID: mentioned.id },
            { $push: { names: { 
                name: `${nameAge} | ${age}`,
                type: 'İsim Değiştirme',
                executor: message.member.id,
                timestamp: Date.now()
            } } },
            { upsert: true },
        );
    }
}