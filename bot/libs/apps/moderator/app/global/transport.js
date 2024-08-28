const { Client, Message, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Transport extends ICommand {
    constructor(client) {
        super(client, {
            name: 'çek',
            aliases: ['cek', 'transport', 'seslicek', 'yanimacekaq'],
            usage: 'çek <@üye/ID>',
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
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!mentioned) {
            message.channel.send({ embeds: [embed.description(client.replys.member)]});
            return;
        }

        if (!await checkUser(message, mentioned, embed)) {
            return;
        }

        if(!message.member.voice.channel) {
            message.channel.send({ embeds: [embed.description(`Sesli kanalda bulunmadığınızdan kişi çekilemedi.`)] });
            return;
        }

        if(!mentioned.voice.channel) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında bulunmadığından sese çekilemedi.`)] });
            return;
        }

        if(mentioned.voice.channelId === message.member.voice.channelId) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ile aynı ses kanalında bulunuyorsunuz.`)] });
            return;
        }

       if(message.member.permissions.has(PermissionFlagsBits.Administrator) || client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role))) {
            mentioned.voice.setChannel(message.member.voice.channelId);
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi bulunduğunuz ${message.guild.getchannel(message.member.voice.channelId)} kanalına taşındı.`)] });
            let loggetir = message.guild.getchannel('transport-log');
            if(loggetir) {
                await loggetir.send({ embeds: [
                    embed.description(`${message.guild.getemoji(client.reactions.voice)} ${mentioned} kişisi ${message.member} tarafından ${message.member.voice.channel} kanalına çekildi.
                        
${message.guild.getemoji(client.reactions.icon)} Çekilen kanal: ${message.member.voice.channel}
${message.guild.getemoji(client.reactions.icon)} Çeken kullanıcı: ${message.member}
${message.guild.getemoji(client.reactions.icon)} Eylem gerçekleşme: ${history(Date.now())} (${unix(Date.now())})
`)
                ]})
            }
       } else {
        let row = new ActionRowBuilder().addComponents(
            button({
                id: 'ettisanal8',
                style: 'Secondary',
                emoji: 'confirm'
            }),
            button({
                id: 'etmediamkuzuldum',
                style: 'Secondary',
                emoji: 'cancel'
            })
        )

        await message.channel.send({ content: `<@${mentioned.id}>`, embeds: [embed.description(`${mentioned}, ${message.member} kişisi seni ${message.member.voice.channel} odasına çekmek istiyor kabul ediyor musun?`)], components: [row] }).then(async mesg => {
            const filter = (interaction) => interaction.user.id === mentioned.id;
            const collector = mesg.createMessageComponentCollector({ filter, time: 30000 });
            
            collector.on('collect', async (interaction) => {
                if(interaction.customId === "ettisanal8") {
                    row.components[0].setDisabled(true).setStyle(ButtonStyle.Success);
                    row.components[1].setDisabled(true)
                    interaction.deferUpdate();
                    mentioned.voice.setChannel(message.member.voice.channelId);
                    mesg.edit({
                        embeds: [ embed.description(`${mentioned}, ${message.member} kişisi seni ${message.member.voice.channel} odasına çekmek istiyor kabul ediyor musun?\n\n **Kişi odaya çekildi.**`)], components: [row]
                    })
                }
                 if(interaction.customId === "ettisanal8") {
                    row.components[0].setDisabled(true);
                    row.components[1].setStyle(ButtonStyle.Success).setDisabled(true)
                    interaction.deferUpdate();
                    mesg.edit({
                        embeds: [ embed.description(`${mentioned}, ${message.member} kişisi seni ${message.member.voice.channel} odasına çekmek istiyor kabul ediyor musun?\n\n **Kişi kabul etmedi.**`)], components: [row]
                    })
                }
            })
            collector.on('end', () => {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);

            mesg.edit({
                embeds: [ embed.description(`30 saniye içerisinde seçim yapılmadığı için kişi odaya çekilmedi.`)], components: [row]
                    })
            })
        })
    }
  }
}