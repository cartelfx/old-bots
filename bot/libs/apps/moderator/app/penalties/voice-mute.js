const { Client, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const MuteModel = require('../../../../database/moderator/VoiceMuteModel');

module.exports = class VoiceMute extends ICommand {
    constructor(client) {
        super(client, {
            name: 'vmute',
            aliases: ['vm', 'seslimute', 'voicemute'],
            usage: 'vmute',
            category: 'moderation'
        });
    }

    /**
     * @param {Client} client 
     */
        async load(client) {
            scan.voicemute();
        }

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     * @param {Embed} embed
     */
    async command(client, message, args, embed) {
        if(!client.settings.VoiceMuteSorumluları.some(role => message.member.roles.cache.has(role)) && !client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.ÜstYönetimRolleri.some(role => message.member.roles.cache.has(role)) && !client.settings.YönetimRolleri.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [embed.description(client.replys.noadmin)] });

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.channel.send({ embeds: [embed.description(client.replys.member)] });
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        let data = await MuteModel.findOne({ userID: mentioned.id, active: true });
        if(data.notified === true) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisi susturma cezası olmasına rağmen ses kanallarında olmadığı için ceza süresi eksilmiyor.`)] });
        }
        if(data) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisi zaten **sesli** kanallarda susturulmuş.`)] });
        }

        if (!mentioned.voice.channel) {
            return message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında olmadığından sesli kanallarda susturulamaz.`)] });
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
                .setCustomId('bugunlukbukadaryetersonrakonusurum')
                .setPlaceholder('Bir süre ve sebep seçin...')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            const filter = interaction => interaction.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

            await message.channel.send({ embeds: [ embed.description(`${mentioned} kişisini sesli kanallarda susturmak için aşağıdan bir sebep seçiniz.`)], components: [row] }).then(aminakodumunmesaji => {

            collector.on('collect', async interaction => {
                if (interaction.customId === 'bugunlukbukadaryetersonrakonusurum') {
                    const secilenaq = interaction.values[0];
                    duration = reasons[secilenaq].duration;
                    reason = secilenaq;
                    await aminakodumunmesaji.delete();
                    await penalties.voicemute(mentioned, message.author, duration, reason, message);
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
            await penalties.voicemute(mentioned, message.author, duration, reason, message);
        }
    }
};