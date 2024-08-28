const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Register extends ICommand {
    constructor(client) {
        super(client, {
            name: 'kayıt',
            aliases: ['reg', 'register', 'e', 'k', 'kadın', 'erkek'],
            usage: 'kayıt <@üye/ID> <isim> <yaş>',
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
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
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

        let nameData = await UserModel.findOne({ userID: mentioned.id });

        let messageContent = `${(nameData?.names?.length ? `
${mentioned} kişisinin ismi başarıyla "${nameAge} | ${age}" ismine değiştirildi. Bu üye daha önce şu isimlerle kayıt olmuş:\n
Kişinin Toplamda ${nameData.names.length} isim kayıtı bulundu.
${nameData.names.map(x => `\`• ${x.name}\` (${x.type.replace('Erkek', `<@&${client.settings.ErkekRolleri.find(role => role)}>`).replace('Kadın', `<@&${client.settings.KadınRolleri.find(role => role)}>`)}) ${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor) : 'Bilinmeyen Kişi.'} ${unix(x.timestamp)}`).slice(0, 10).join("\n ")}\n
Kişinin önceki isimlerine \`${config.bot_options.prefixes[0]}isimler @üye\` komutuyla kontrol ederek kayıt işlemini gerçekleştirmeniz önerilir.` 
                : `${mentioned} kişisinin ismi başarıyla "${nameAge} | ${age}" ismine değiştirildi.`)}`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('male')
                    .setLabel('Erkek')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('female')
                    .setLabel('Kadın')
                    .setStyle(ButtonStyle.Secondary)
            );

        let registermsg = await message.channel.send({
            embeds: [embed.description(messageContent)],
            components: [row]
        });

        const filter = i => i.user.id === message.author.id;
        const collector = registermsg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            let gender = interaction.customId === 'male' ? 'Erkek' : 'Kadın';
            interaction.deferUpdate();
            mentioned.setNickname(`${mentioned.user.username.includes(client.settings.ServerTag) ? client.settings.ServerTag : client.settings.UnTag} ${rawName.split(' ').map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join(' ')} | ${age}`);
            await register(mentioned, message.member, `${nameAge} | ${age}`, gender);
            if(gender === 'Erkek') {
                row.components[0].setStyle(ButtonStyle.Success).setDisabled(true);
                row.components[1].setDisabled(true);
            } else if(gender === 'Kadın') {
                row.components[1].setStyle(ButtonStyle.Success).setDisabled(true);
                row.components[0].setDisabled(true);
            }
            await registermsg.edit({
                embeds: [embed.description(`${messageContent}\n\n${bold(gender)} olarak kaydedildi.`)],
                components: [row]
            });
        });

        collector.on('end', () => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
        });
    }
}