const { Client, Message, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');

module.exports = class Transport extends ICommand {
    constructor(client) {
        super(client, {
            name: 'git',
            aliases: ['gıt', 'sesegit'],
            usage: 'git <@üye/ID>',
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

        if(message.member.user.bot) {
            message.channel.send({ embeds: [embed.description(client.replys.bot)] });
            return;
        }

        if(!message.member.voice.channel) {
            message.channel.send({ embeds: [embed.description(`Sesli kanalda bulunmadığınızdan kişinin odasına katılamazsınız.`)] });
            return;
        }

        if(!mentioned.voice.channel) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ses kanalında bulunmadığından sesine katılamazsınız.`)] });
            return;
        }

        if(mentioned.voice.channelId === message.member.voice.channelId) {
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisi ile aynı ses kanalında bulunuyorsunuz.`)] });
            return;
        }

       if(message.member.permissions.has(PermissionFlagsBits.Administrator) || client.settings.KurucuRolleri.some(role => message.member.roles.cache.has(role))) {
            message.member.voice.setChannel(mentioned.voice.channelId);
            message.channel.send({ embeds: [embed.description(`${mentioned} kişisinin bulunduğu  ${message.guild.getchannel(message.member.voice.channelId)} kanalına çekildiniz.`)] });
            let loggetir = message.guild.getchannel('get-log');
            if(loggetir) {
                await loggetir.send({ embeds: [
                    embed.description(`${message.guild.getemoji(client.reactions.voice)} ${message.member} kişisi ${mentioned} kişisinin ${message.member.voice.channel} kanalına gitti.
                        
${message.guild.getemoji(client.reactions.icon)} Gidilen kanal: ${message.member.voice.channel}
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

        await message.channel.send({ content: `<@${mentioned.id}>`, embeds: [embed.description(`${mentioned}, ${message.member} kişisi bulunduğun ${message.member.voice.channel} odaya gelmek istiyor kabul ediyor musun?`)], components: [row] }).then(async mesg => {
            const filter = (interaction) => interaction.user.id === mentioned.id;
            const collector = mesg.createMessageComponentCollector({ filter, time: 30000 });
            
            collector.on('collect', async (interaction) => {
                if(interaction.customId === "ettisanal8") {
                    row.components[0].setDisabled(true).setStyle(ButtonStyle.Success);
                    row.components[1].setDisabled(true)
                    interaction.deferUpdate();
                    mentioned.voice.setChannel(message.member.voice.channelId);
                    mesg.edit({
                        embeds: [ embed.description(`${mentioned}, ${message.member} kişisi bulunduğun ${message.member.voice.channel} odaya gelmek istiyor kabul ediyor musun?\n\n **Kişi odaya gitti.**`)], components: [row]
                    })
                }
                 if(interaction.customId === "etmediamkuzuldum") {
                    row.components[0].setDisabled(true);
                    row.components[1].setStyle(ButtonStyle.Danger).setDisabled(true)
                    interaction.deferUpdate();
                    mesg.edit({
                        embeds: [ embed.description(`${mentioned}, ${message.member} kişisi bulunduğun ${message.member.voice.channel} odaya gelmek istiyor kabul ediyor musun?\n\n **Kişi odaya gitmeyi kabul etmedi.**`)], components: [row]
                    })
                }
            })
            collector.on('end', () => {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);

            mesg.edit({
                embeds: [ embed.description(`30 saniye içerisinde seçim yapılmadığı için kişi odaya gitmedi.`)], components: [row]
                    })
            })
        })
    }
  }
}