const { Client, Message, ActionRowBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const StatModel = require('../../../../database/stats/StatModel');

class StatCommand extends ICommand {
    constructor(client) {
        super(client, {
            name: 'stat',
            aliases: ['verim'],
            usage: 'stat [gün sayısı]',
            category: 'statistics'
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
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let data = await StatModel.findOne({ guildID: message.guild.id, userID: mentioned.user.id });
        if(!data) return message.channel.send((
            embed.description(`Veriniz bulunmamaktadır.`)
        ))
        let haftalikSesToplam = 0;
        let chattoplam = 0;
        let voicetoplam = 0;
        if(data.lifeChatStats) {
          data.lifeChatStats.forEach(c => chattoplam += c);
        }
        let günlükses = 0, ikihaftalik = 0, aylıkses = 0, toplamses = 0;
        let günlükmesaj = 0, haftalıkmesaj = 0, aylıkmesaj = 0, toplammesaj = 0;
        let haftalık = {}, aylık = {}, günlük = {};
        let day = await getday(message.guild.id);
        let haftalıkm = {}, aylıkm = {}, kategori = {};

        if(data.allMessage) {
          let days = Object.keys(data.allMessage);
          days.forEach(_day => {
              let sum = Object.values(data.allMessage[_day]).reduce((x, y) => x + y, 0);
              toplammesaj += sum;
              if (day == Number(_day)) {
                  günlükmesaj += sum;
              }
              if (_day <= 7) {
                  haftalıkmesaj += sum;
                  let keys = Object.keys(data.allMessage[_day]);
                  keys.forEach(key => {
                      if (haftalıkm[key]) haftalıkm[key] += data.allMessage[_day][key];
                      else haftalıkm[key] = data.allMessage[_day][key];
                  });
              }
              if (_day <= 30) {
                  aylıkmesaj += sum;
                  let keys = Object.keys(data.allMessage[_day]);
                  keys.forEach(key => {
                      if (aylıkm[key]) aylıkm[key] += data.allMessage[_day][key];
                      else aylıkm[key] = data.allMessage[_day][key];
                  });
              }
          });
        }

        if(data.allVoice && data.allVoiceCategory) {
          let days = Object.keys(data.allVoice || {});
           days.forEach(_day => {
              let sum = Object.values(data.allVoice[_day]).reduce((x, y) => x + y, 0);
              toplamses += sum;
              let keys = Object.keys(data.allVoiceCategory[_day]);
                  keys.forEach(key => {
                      if (kategori[key]) kategori[key] += data.allVoiceCategory[_day][key];
                      else kategori[key] = data.allVoiceCategory[_day][key];
                  });

              if (day == Number(_day)) {
                  günlükses += sum;
                  günlük = Object.keys(data.allVoice[_day]).map(e => Object.assign({ Channel: e, Value: data.allVoice[_day][e] }));
              }
              if (_day <= 7) {
                ikihaftalik += sum;
                  let keys = Object.keys(data.allVoice[_day]);
                  keys.forEach(key => {
                      if (haftalık[key]) haftalık[key] += data.allVoice[_day][key];
                      else haftalık[key] = data.allVoice[_day][key];
                  });
              }
              
              if (_day <= 30) {
                  aylıkses += sum;
                  let keys = Object.keys(data.allVoice[_day]);
                  keys.forEach(key => {
                      if (aylık[key]) aylık[key] += data.allVoice[_day][key];
                      else aylık[key] = data.allVoice[_day][key];
                  });
              }
          });
        } 

        if(data.lifeVoiceStats) {
          data.lifeVoiceStats.forEach(c => voicetoplam += c);
          data.lifeVoiceStats.forEach((value, key) => {
          });  
        }

        if(data.voiceStats) {
          data.voiceStats.forEach(c => haftalikSesToplam += c);
        }
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);

        let qwklkdqwşkqlkwkqşkdwqlkw = [];

       if (mentioned.voice.channel && mentioned.voice.channel.members.size > 0) {
           const memberNames = [];
           mentioned.voice.channel.members.forEach(member => {
            if (member.id !== mentioned.id) {
               memberNames.push(member.user.displayName);
            }
           });
          
           qwklkdqwşkqlkwkqşkdwqlkw.push({
               memberCount: memberNames.length,
               members: memberNames
           });
       }
       
       let sesKontrol = ``;
       
       if (mentioned.voice.channel && mentioned.voice.channelId) {
           sesKontrol = `${mentioned.voice.channel.name} isimli kanalda bulunuyor, ses kanalında ${qwklkdqwşkqlkwkqşkdwqlkw.length > 0 ? qwklkdqwşkqlkwkqşkdwqlkw[0].memberCount : 0} kişi bulunuyor. 
Ses kanalında bulunan kişilerin listesi: ${qwklkdqwşkqlkwkqşkdwqlkw.length > 0 ? qwklkdqwşkqlkwkqşkdwqlkw[0].members.join('\n') : 'Bulunamadı.'}`;
       }

       let Row = new ActionRowBuilder().addComponents(
        menu({
            id: 'stat_selection',
            placeholder: 'Lütfen aşağıdan seçim yapınız.',
            options: [
                { label: 'Ses Verileri', description: 'Sunucudaki ses istatistiklerini gösterir.', emoji: 'voice', value: 'ses' },
                { label: 'Mesaj Verileri', description: 'Sunucudaki mesaj istatistiklerini gösterir.', emoji: 'chat', value:'mesaj' },
                { label: 'Yayın Verileri', description: 'Sunucudaki yayın istatistiklerini gösterir.', emoji: 'image', value:'stream' },
                { label: 'Kamera Verileri', description: 'Sunucudaki kamera istatistiklerini gösterir.', emoji: 'cam', value: 'cam' },
                { label: 'Taglı Verileri', description: 'Sunucudaki taglı istatistiklerini gösterir.', emoji: 'star', value: 'taglı' },
                { label: 'Davet Verileri', description: 'Sunucudaki davet istatistiklerini gösterir.', emoji: 'invite', value: 'davet' }
            ]
        }),
    );
        const statText = await message.channel.send({ components: [Row], embeds: [ embed.description(`${message.guild.getemoji(client.reactions.stat)} ${mentioned} sunucu istatistik bilgilerine aşağıdaki menüden seçerek ulaşa bilirsin.`)]})
        var filter = i => i.user.id == message.member.id
        let collector = statText.createMessageComponentCollector({filter: filter, time: 60000, error: ["time"]})
        
        collector.on("collect", i => {
            if(i.values[0] == "ses") {
            i.deferUpdate();
          statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin ses verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Ses Kategorilerinin Detayları**
${Object.keys(kategori).length > 0 ? Object.keys(kategori).sort((x, y) => kategori[y] - kategori[x]).splice(0, 15).map((data, index) => {
  let channel = message.guild.channels.cache?.get(data);
  return `${message.guild.getemoji(client.reactions.icon)} ${channel ? channel.name : "#kategori-silinmiş"}: \`${duration(kategori[data])}\``;
  }).join("\n") : "Bulunamadı."}

${message.guild.getemoji(client.reactions.stat)} **Ses Kategorilerinin İstatistikleri**
${message.guild.getemoji(client.reactions.icon)} Toplam Ses Verisi: ${duration(toplamses)}
${message.guild.getemoji(client.reactions.icon)} Public Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Teyit Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Yayın Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Sorun Çözme Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Eğlence & Oyun Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Alone Odaları Verisi: 0 daha amk
${message.guild.getemoji(client.reactions.icon)} Private Odaları Verisi: 0 daha amk

${message.guild.getemoji(client.reactions.stat)} **Ses Kanallarının Detayları**
${Object.keys(aylık).length > 0 ? Object.keys(aylık).sort((x, y) => aylık[y] - aylık[x]).splice(0, 15).map((data, index) => {
  let channel = message.guild.channels.cache?.get(data);
  return `${message.guild.getemoji(client.reactions.icon)} ${channel ? channel : "#kanal-silinmiş"}: \`${duration(aylık[data])}\``;
  }).join("\n") : "Bulunamadı."}

${message.guild.getemoji(client.reactions.star)} Toplamda **${Object.keys(data.allVoice).length}** kanalda vakit geçirmiş.
${sesKontrol}
`)]})
            }

            if(i.values[0] == "mesaj") {
              i.deferUpdate();
            statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin mesaj verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Mesaj Kanallarının Detayları**
${Object.keys(aylıkm).length > 0 ? Object.keys(aylıkm).sort((x, y) => aylıkm[y] - aylıkm[x]).splice(0, 15).map((data, index) => {
  let channel = message.guild.channels.cache?.get(data);
  return `${message.guild.getemoji(client.reactions.icon)} ${channel ? channel : "#kanal-silinmiş" }: \`${aylıkm[data]} Mesaj\``;
}).join("\n") : "Veri bulunamadı"}

${message.guild.getemoji(client.reactions.star)} Toplamda **${Object.keys(data.allMessage).length}** kanala mesaj atmış.
`)]})
            }

            if(i.values[0] == "stream") {
              statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin yayın verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Yayın Yapılan Kanalların Detayları**
${message.guild.getemoji(client.reactions.icon)} Toplam Yayın Verisi: \`${duration(data.totalStreamStats)}\`
`)]})
      }

      if(i.values[0] == "cam") {
        statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin kamera verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Kamera Açılan Kanalların Detayları**
${message.guild.getemoji(client.reactions.icon)} Toplam Kamera Verisi: \`${duration(data.totalCameraStats)}\`
`)]})
}

if(i.values[0] == "taglı") {
  if (!mentioned.roles.cache?.some(rol => message.guild.roles.cache?.get(roller?.ilkYetki).position <= rol?.position)) {
    i.reply({ content: `Yetkili olmadığın için bu veriye erişemezsin.`, ephemeral: true});
    return;
}
  statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin taglı verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Taglı Olarak Belirtilen Kişilerin Detayları**
${userdata.Taglıları.slice(0, 10).map((value, index) => `\` ${index + 1} \` ${message.guild.members.cache?.get(value.id) ? message.guild.members.cache?.get(value.id) : `<@${value.id}>`}  <t:${String(value.Date).slice(0, 10)}:R>`).join("\n") || `Bulunamadı.`}

${message.guild.getemoji(client.reactions.icon)} Toplam Taglı Verisi: \`${userdata.Taglıları?.length || `Bulunamadı.`}\``)]})
}

if(i.values[0] == "davet") {
  statText.edit({ components: [Row], embeds: [embed.description(`${message.guild.getemoji(client.reactions.info)} ${mentioned} kişisinin davet verileri aşağıda belirtilmiştir.

${message.guild.getemoji(client.reactions.stat)} **Davet Edilen Kişilerin Detayları**
${message.guild.getemoji(client.reactions.icon)} Toplam Davet Verisi: \`${invdata ? invdata?.total : `Bulunamadı`}\``)]})
}

    })
    collector.on('end', () => {
       
    })
    }
}

module.exports = StatCommand;