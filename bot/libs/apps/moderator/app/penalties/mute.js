const { Client, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const MuteModel = require('../../../../database/moderator/MuteModel');

module.exports = class Mute extends ICommand {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['cmute', 'cm', 'chatmute'],
            usage: 'mute <@üye/ID>',
            category: 'moderation'
        });
    }

    /**
     * @param {Client} client 
     */
        async load(client) {
            scan.mute();
        }
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        if(!client.settings.ChatMuteSorumluları.some(role => message.member.roles.cache.has(role)) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.YönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        let data = await MuteModel.findOne({ userID: mentioned.id, active: true });

        if(data) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisi zaten **metin** kanallarında susturulmuş.`)] });
        }

        let reasons = {
            'Kışkırtma': { duration: '10m', description: 'Kullanıcıyı kışkırtmadan dolayı 10 dakika susturur.' },
            'Spam': { duration: '30m', description: 'Kullanıcıyı spamdan dolayı 30 dakika susturur.' },
            'Hakaret': { duration: '1h', description: 'Kullanıcıyı hakaretten dolayı 1 saat susturur.' }
        };

        let duration = args[1];
        let reason = args.slice(2).join(' ');

        if (!duration || !reason) {
            const options = Object.keys(reasons).map(key => 
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${key} - ${reasons[key].duration}`)
                    .setValue(key)
                    .setDescription(reasons[key].description)
            );

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('11111111110')
                .setPlaceholder('Bir süre ve sebep seçin...')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            const filter = interaction => interaction.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

            await message.channel.send({ embeds: [ embed.description(`${mentioned} kişisini metin kanallarında susturmak için aşağıdan bir sebep seçiniz.`)], components: [row] }).then(aminakodumunmesaji => {

            collector.on('collect', async interaction => {
                if (interaction.customId === '11111111110') {
                    const secilenaq = interaction.values[0];
                    duration = reasons[secilenaq].duration;
                    reason = secilenaq;
                    await aminakodumunmesaji.delete();
                    await penalties.mute(mentioned, message.author, duration, reason, message);
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    aminakodumunmesaji.delete();
                    message.channel.send({ embeds: [ embed.description(`30 saniye içerisinde seçim yapılmadığı için iptal edildi.`)] });
                }
            });
        })
        } else {
            await penalties.mute(mentioned, message.author, duration, reason, message);
        }
    }
};