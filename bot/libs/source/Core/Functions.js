const { Message, GuildMember, Embed, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, User, VoiceState, bold } = require("discord.js");
const Mute = require("../../database/moderator/MuteModel");
const VoiceMute = require("../../database/moderator/VoiceMuteModel");
const ms = require('ms');
const TIMES = require("../../database/stats/Times");
const VOICELOGS = {};
const CHAT = require('../System/bases/chat');
const embooo = require('./Embed')
const embed = new embooo()
const PENALTYMODEL = require('../../database/moderator/PenaltyModel');

/**
 * @param {Date} date
 * @returns {number}
 */
const comparedate = global.comparedate = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days;
};

/**
 * @param {Date} date
 * @returns {number}
 */
const checkSecs = global.checkSecs = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let seconds = Math.floor(diff / 1000);
    return seconds;
};

/**
 * @param {Date} date
 * @returns {number}
 */
const checkMins = global.checkMins = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let minutes = Math.floor(diff / 60000);
    return minutes;
};

/**
 * @param {Date} date
 * @returns {number}
 */
const checkHours = global.checkHours = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let hours = Math.floor(diff / 3600000);
    return hours;
};

/**
 * @param {Date} date
 * @returns {number}
 */
const checkDays = global.checkDays = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days;
};

/**
 * @param {Array} array
 * @param {string} key
 * @returns {Array}
 */
const sortByKey = global.sortByKey = function (array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
};

GuildMember.prototype.setroles = function(roles= []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles);
    return this.roles.set(rol).catch(err => {});
}

/**
 * @param {Object} obj
 * @param {*} value
 * @param {string} [path='']
 * @returns {string|undefined}
 */
const getPath = global.getPath = function (obj, value, path) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var currentPath = path ? path + '.' + key : key;
            var v = obj[key];
            if (v === value) {
                return currentPath;
            }
            var res = getPath(v, value, currentPath);
            if (res) {
                return res;
            }
        }
    }
};

/**
 * @param {Array} pArray
 * @returns {Array}
 */
const shuffle = global.shuffle = function (pArray) {
    let array = pArray.slice();
    let currentIndex = array.length, temporaryValue, randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
};

/**
 * @param {number} ms
 * @returns {string}
 */
const unix = global.unix = function(ms) {
    const seconds = Math.floor(ms / 1000);
    return `<t:${seconds}:R>`;
}

/**
 * @param {number} drt
 * @returns {string}
 */
const duration = global.duration = function (drt) {
    const totalMinutes = Math.floor(drt / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours} saat ${minutes} dk`;
    } else if (minutes > 0) {
        return `${minutes} dk`;
    } else {
        return `0 dk`;
    }
};

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomNum = global.randomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * @param {string} num
 * @returns {boolean}
 */
const number = global.number = function (num) {
    var reg = new RegExp("^\\d+$");
    return reg.test(num);
};

const activitytype = global.activitytype = function(type) {
    switch (type) {
        case 'Listening':
            return Discord.ActivityType.Listening;
        case 'Playing':
            return Discord.ActivityType.Playing;
        case 'Watching':
            return Discord.ActivityType.Watching;
        case 'Competing':
            return Discord.ActivityType.Competing;
        default:
            return Discord.ActivityType.Playing; 
    }
}

const history = global.history = function(timestamp) {
    const date = new Date(timestamp);

    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
}

/**
 * @param {Message} message
 * @param {GuildMember} member
 * @param {Embed} embed
 */
const checkUser = global.checkUser = async function(message, member, embed) {
    const gonderen = message.member;
    if (!gonderen) return false;

    if (member.user.bot) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.bot)
        ]});
        return false;
    }

    if (member.id === gonderen.id) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.self)
        ]});
        return false;
    }

    if (!message.guild.members.cache.get(member.id)) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.notfound)
        ]});
        return false;
    }

    if (gonderen.id === member.roles.highest.id) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.permission)
        ]});
        return false;
    }

    if (member.roles.highest.rawPosition >= gonderen.roles.highest.rawPosition) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.permissionup)
        ]});
        return false;
    }

    if (message.guild.members.me.roles.highest.id === member.roles.highest.id) {
        await message.channel.send({ embeds: [
            embed.description(client.replys.botpermission)
        ]});
        return false;
    }

    return true;
}

/**
 * @param {GuildMember} member
 * @param {GuildMember} executor
 * @param {String} name
 * @param {String} gender
 */
const register = global.register = async function(member, executor, name, gender) {
    if(gender === 'Erkek') {
        if(client.settings.KadınRolleri.some(role => member.roles.cache.has(role))) {
            await member.roles.remove(client.settings.KadınRolleri);
        }
        await member.roles.add(client.settings.ErkekRolleri);
        await member.roles.remove(client.settings.KayıtsızRolleri);
        await UserModel.findOneAndUpdate(
            { userID: member.id },
             { $push: {
              registers: {
                name: name,
                executor: executor.id,
                gender: 'Erkek',
                timestamp: Date.now(),
              },
              names: { 
                name: name,
                type: 'Erkek',
                executor: executor.id,
                timestamp: Date.now()
            }
            }},
            { upsert: true }
          );

          await UserModel.findOneAndUpdate(
            { userID: executor.id },
             { $push: {
             registrations: {
                member: member.id,
                type: 'Erkek',
                timestamp: Date.now()
             }
            }},
            { upsert: true }
          );
    }

    if(gender === 'Kadın') {
        if(client.settings.ErkekRolleri.some(role => member.roles.cache.has(role))) {
            await member.roles.remove(client.settings.ErkekRolleri);
        }
        await member.roles.add(client.settings.KadınRolleri);
        await member.roles.remove(client.settings.KayıtsızRolleri);
        await UserModel.findOneAndUpdate(
            { userID: member.id },
             { $push: {
              registers: {
                name: name,
                executor: executor.id,
                gender: 'Kadın',
                timestamp: Date.now(),
              },
              names: { 
                name: name,
                type: 'Kadın',
                executor: executor.id,
                timestamp: Date.now()
            },
            }},
            { upsert: true }
          );

          await UserModel.findOneAndUpdate(
            { userID: executor.id },
             { $push: {
             registrations: {
                member: member.id,
                type: 'Kadın',
                timestamp: Date.now()
             }
            }},
            { upsert: true }
          );
    }
}

/**
 * @param {Message} message 
 * @param {Array<Object>} data 
 * @param {Embed} embed 
 * @param {number} indexsayi
 * @param {Function} formatItem 
 */
const pages = global.pages = async function(message, data, embed, indexsayi = 10, formatItem) {
    let currentPage = 1;
    indexsayi = Math.max(indexsayi, 10);

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const fetchemb = (dataa) => {
        const descriptions = dataa.map(formatItem);
        
        return embed
            .description(descriptions.join('\n'))
            .setFooter({ text: `Sayfa ${currentPage}/${Math.ceil(data.length / indexsayi)}` });
    };

    const buttonsfetch = () => {
        return new ActionRowBuilder()
            .addComponents(
                button({
                    id: 'prev',
                    style: 'Secondary',
                    disabled: currentPage === 1,
                    emoji: 'leave'
                }),
                button({
                    id: 'next',
                    style: 'Secondary',
                    disabled: currentPage === Math.ceil(data.length / indexsayi),
                    emoji: 'join'
                })
            );
    };

    let datapaginate = paginate(data, indexsayi, currentPage);
    let embedMessage = await message.channel.send({ embeds: [fetchemb(datapaginate)], components: [buttonsfetch()] });

    const col = embedMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000
    });

    col.on('collect', async i => {
        if (i.user.id !== message.author.id) return;

        if (i.customId === 'prev') {
            currentPage = currentPage > 1 ? currentPage - 1 : 1;
        } else if (i.customId === 'next') {
            currentPage = currentPage < Math.ceil(data.length / indexsayi) ? currentPage + 1 : currentPage;
        }

        datapaginate = paginate(data, indexsayi, currentPage);
        await i.update({ embeds: [fetchemb(datapaginate)], components: [buttonsfetch()] });
    });
};

/**
 * @param {String} id
 * @param {String} label
 * @param {String} style
 * @param {Boolean} disabled
 * @param {String} emoji
 */
const button = global.button = function({ id, label = '', style, disabled = false, emoji = '', url = ''}) {
    const richbutton = new ButtonBuilder()
        .setStyle(ButtonStyle[style] || ButtonStyle.Primary)
        .setDisabled(disabled);

        if(!url) {
            richbutton.setCustomId(id)
        }

        if(label) {
            richbutton.setLabel(label);
        }

    if (emoji) {
        const em = client.guilds.cache.get(client.guild).getemoji(emoji);
        if (em) {
            richbutton.setEmoji(em.id ? { id: em.id } : { name: em.name });
        }
    }

    if(url) {
        richbutton.setURL(url);
    }

    return richbutton;
}

/**
 * @param {String} id
 * @param {String} placeholder
 * @param {Array} options
 * @param {Boolean} disabled
 */
const menu = global.menu = function({ id, placeholder = '', options = [], disabled = false }) {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)
        .setDisabled(disabled);

    options.forEach(option => {
        const menuOption = new StringSelectMenuOptionBuilder()
            .setLabel(option.label)
            .setValue(option.value)
            
            if (option.description) {
                menuOption.setDescription(option.description);
            }

        if (option.emoji) {
            const emoji = client.guilds.cache.get(client.guild).getemoji(option.emoji);
            if (emoji) {
                menuOption.setEmoji(emoji.id ? { id: emoji.id } : { name: emoji.name });
            }
        }

        selectMenu.addOptions(menuOption);
    });

    return selectMenu;
};

/**
 * @param {String} id
 * @param {String} title
 * @param {Array} inputs
*/
const modal = global.modal = function({ id, title, inputs = [] }) {
    const modal = new ModalBuilder()
        .setCustomId(id)
        .setTitle(title);

    inputs.forEach(input => {
        const textInput = new TextInputBuilder()
            .setCustomId(input.customId)
            .setLabel(input.label)
            .setStyle(input.style || TextInputStyle.Short)
            .setPlaceholder(input.placeholder || '')
            .setRequired(input.required || false);

        const row = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(row);
    });

    return modal;
}

/**
 * @param {VoiceState} state
 */
const checkjoin = global.checkjoin = async function(state) {
    const member = state.member;
    const channel = state.channelId;

    if (!VOICELOGS[member.id]) {
        VOICELOGS[member.id] = {};
    }

    if (!VOICELOGS[member.id][channel]) {
        VOICELOGS[member.id][channel] = [];
    }

    VOICELOGS[member.id][channel] = VOICELOGS[member.id][channel].filter(timestamp => Date.now() - timestamp < 60000);
    VOICELOGS[member.id][channel].push(Date.now());

    if (VOICELOGS[member.id][channel].length >= 5) {
        await member.timeout(10 * 60000, 'Bir kanala art arda çok fazla kez giriş yapıldı.');

        await member.send({ embeds: [ 
            embed.description(`Merhaba ${member}! ses kanalına 5 kez art arda girip çıktığınız için **10 dakika** boyunca sesli ve metin kanallarından uzaklaştırıldınız.`)
        ]})

        let log = member.guild.getchannel('mute-log');
        if(log) log.send({ embeds: [ 
            embed.description(`${member} kişisi ses kanalına 5 kez art arda giriş yaptığındam dolayı **10 dakika** süre boyunca sesli ve metin kanallarından uzaklaştırıldı.`)
        ]})

        VOICELOGS[member.id][channel] = [];
    }
};

const penalties = global.penalties = function() {};

/**
 * @param {GuildMember} member
 * @param {User} executor
 * @param {String} duration
 * @param {String} reason
 * @param {Message} message
 */
penalties.voicemute = async function(member, executor, drt, reason = 'Sebep belirtilmemiş.', message) {
    const muteDuration = ms(drt);

    await member.voice.setMute(true, reason);

    const cezano = await PENALTYMODEL.countDocuments({}) + 1;

    await PENALTYMODEL.updateOne(
        { userID: member.id },
        {
            $set: {
                number: cezano.toString(),
                executor: executor.id,
                type: 'Voice Mute',
                reason: reason,
                timestamp: Date.now(),
                end: new Date(Date.now() + muteDuration),
                active: true
            }
        },
        { upsert: true }
    );

    await VoiceMute.updateOne(
        { userID: member.id },
        {
            $set: {
                executor: executor.id,
                reason,
                muteDuration,
                end: Date.now() + muteDuration,
                active: true,
                notified: false
            }
        },
        { upsert: true }
    );

    await message.channel.send({
        embeds: [
            embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.confirm)} ${member} kişisi ${bold(reason)} sebebiyle \`${duration(muteDuration)}\` boyunca sesli kanallarda susturuldu. \`(Ceza Numarası: #${cezano})\``)]
    })

    let log = member.guild.getchannel('mute-log');
    if (log) {
        log.send({ 
            embeds: [ 
                embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.mute)} ${member} kişisi ${executor} tarafından sesli susturuldu.

${member.guild.getemoji(client.reactions.icon)} Susturma atan yetkili: ${executor}
${member.guild.getemoji(client.reactions.icon)} Susturma sebebi: ${reason}
${member.guild.getemoji(client.reactions.icon)} Susturma bitiş tarihi: ${history(Date.now() + muteDuration)} (${unix(Date.now() + muteDuration)})`)
            ]
        });
    }
};

/**
 * @param {GuildMember} member
 * @param {User} executor
 * @param {String} duration
 * @param {String} reason
 * @param {Message} message
 */
penalties.mute = async function(member, executor, drt, reason = 'Sebep belirtilmemiş.', message) {
    const muteDuration = ms(drt);

    await member.roles.add(client.settings.ChatMuteRolü);

    const cezano = await PENALTYMODEL.countDocuments({}) + 1;

    await PENALTYMODEL.updateOne(
        { userID: member.id },
        {
            $set: {
                number: cezano.toString(),
                executor: executor.id,
                type: 'Chat Mute',
                reason: reason,
                timestamp: Date.now(),
                end: new Date(Date.now() + muteDuration),
                active: true
            }
        },
        { upsert: true }
    );

    await Mute.updateOne(
        { userID: member.id },
        {
            $set: {
                executor: executor.id,
                reason,
                muteDuration,
                end: Date.now() + muteDuration,
                active: true,
            }
        },
        { upsert: true }
    );

    await message.channel.send({
        embeds: [
            embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.confirm)} ${member} kişisi ${bold(reason)} sebebiyle \`${duration(muteDuration)}\` boyunca metin kanallarında susturuldu. \`(Ceza Numarası: #${cezano})\``)]
    })

    let log = member.guild.getchannel('mute-log');
    if (log) {
        log.send({ 
            embeds: [ 
                embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.mute)} ${member} kişisi ${executor} tarafından metin kanallarında susturuldu.

${member.guild.getemoji(client.reactions.icon)} Susturma atan yetkili: ${executor}
${member.guild.getemoji(client.reactions.icon)} Susturma sebebi: ${reason}
${member.guild.getemoji(client.reactions.icon)} Susturma bitiş tarihi: ${history(Date.now() + muteDuration)} (${unix(Date.now() + muteDuration)})`)
            ]
        });
    }
};


/**
 * @param {GuildMember} member
 * @param {User} executor
 * @param {String} reason
 * @param {Message} message
 */
penalties.underworld = async function(member, executor, reason = 'Sebep belirtilmemiş.', message) {

    await member.setroles(client.settings.YasaklıRolü);

    const cezano = await PENALTYMODEL.countDocuments({}) + 1;

    await PENALTYMODEL.updateOne(
        { userID: member.id },
        {
            $set: {
                number: cezano.toString(),
                executor: executor.id,
                type: 'Underworld',
                reason: reason,
                timestamp: Date.now(),
                end: null,
                active: true
            }
        },
        { upsert: true }
    );

    await message.channel.send({
        embeds: [
            embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.confirm)} ${member} kişisi ${bold(reason)} sebebiyle sunucudan uzaklaştırıldı. \`(Ceza Numarası: #${cezano})\``)]
    })

    let log = member.guild.getchannel('underworld-log');
    if (log) {
        log.send({ 
            embeds: [ 
                embed.author(message.member.user.username, message.member.user.avatarURL()).timestamp().description(`${message.guild.getemoji(client.reactions.confirm)} ${member} kişisi ${executor} tarafından sunucudan uzaklaştırıldı.

${member.guild.getemoji(client.reactions.icon)} Cezalandıran yetkili: ${executor}
${member.guild.getemoji(client.reactions.icon)} Ceza sebebi: ${reason}`)
            ]
        });
    }
};

// SCAN PUNISHMENTS
const scan = global.scan = function() {};

scan.voicemute = function() {
    setInterval(async () => {
        const Mutes = await VoiceMute.find({ active: true });

        for (const mute of Mutes) {
            const member = client.guilds.cache.get(client.guild).members.cache.get(mute.userID);
            const executor = client.guilds.cache.get(client.guild).members.cache.get(mute.executor);
            if (!member) continue;

            if (!member.voice.channel) {
                if (!mute.notified) {
                    await member.send({
                        embeds: [
                            embed.author(executor.user.username, executor.user.avatarURL()).timestamp().description(`Merhaba ${member}, ${duration(mute.timestamp)} **sesli** susturma cezası süre zarfında sesli kanalda olmadığınız süre ceza süresinden eksilmeyecektir.`)
                        ]
                    });
                    await VoiceMute.updateOne(
                        { userID: member.id },
                        { $set: { notified: true } }
                    );
                }
                continue;
            }

            if (Date.now() >= mute.end) {
                if (member.voice.serverMute) {
                    await member.voice.setMute(false);
                }

                 await PENALTYMODEL.updateOne(
                    { userID: member.id },
                    { $set: { active: false } }
                )

                await VoiceMute.updateOne(
                    { member: member.id },
                    { $set: { active: false } }
                );

                const log = member.guild.channels.cache.find(ch => ch.name === 'unmute-log');
                if (log) log.send({ 
                    embeds: [
                        embed.author(executor.user.username, executor.user.avatarURL()).timestamp().description(`${member.guild.getemoji(client.reactions.unmute)} ${member} kişisinin sesli susturması kaldırıldı.
                        
${member.guild.getemoji(client.reactions.icon)} Susturma atan yetkili: ${executor}
${member.guild.getemoji(client.reactions.icon)} Susturma atılan tarih: ${history(mute.timestamp)} (${unix(mute.timestamp)})
${member.guild.getemoji(client.reactions.icon)} Susturma sebebi: ${mute.reason}`)
                    ]
                })
            } else if (!member.voice.serverMute) {
                await member.voice.setMute(true, 'Susturması olmasına rağmen mikrofon bugu yapmak.');
                await member.timeout(mute.end - Date.now(), 'Susturması olmasına rağmen mikrofon bugu yapmak.');
                await member.send({
                    embeds: [
                        embed.description(`Merhaba ${member}, sistemde kayıtlı **sesli** susturmanız olmanıza rağmen mikrofonunuz açık olduğundan yeniden susturma işlemi uygulandı.`)
                    ]
                });
            }
        }
    }, 2000);
};

scan.mute = function() {
    setInterval(async () => {
        const Mutes = await Mute.find({ active: true });

        for (const mute of Mutes) {
            const member = client.guilds.cache.get(client.config.guild.id).members.cache.get(mute.userID);
            const executor = client.guilds.cache.get(client.config.guild.id).members.cache.get(mute.executor);
            if (!member) continue;

            if (Date.now() >= mute.end) {
                if (member.roles.cache.has(client.settings.ChatMuteRolü)) {
                    await member.roles.remove(client.settings.ChatMuteRolü);
                }

                await PENALTYMODEL.updateOne(
                    { userID: member.id },
                    { $set: { active: false } }
                )
                await Mute.updateOne(
                    { member: member.id },
                    { $set: { active: false } }
                );

                const log = member.guild.channels.cache.find(ch => ch.name === 'unmute-log');
                if (log) log.send({ 
                    embeds: [
                        embed.author(executor.user.username, executor.user.avatarURL()).timestamp().description(`${member.guild.getemoji(client.reactions.unmute)} ${member} kişisinin metin susturması kaldırıldı.
                        
${member.guild.getemoji(client.reactions.icon)} Susturma atan yetkili: ${executor}
${member.guild.getemoji(client.reactions.icon)} Susturma atılan tarih: ${history(mute.timestamp)} (${unix(mute.timestamp)})
${member.guild.getemoji(client.reactions.icon)} Susturma sebebi: ${mute.reason}`)
                    ]
                })
            }
        }
    }, 2000);
};

const checkday = global.checkday = async function() {
    let guild = client.guild;
    let data = await TIMES.findOne({ guildID: guild})
    if (!data) return new TIMES({ guildID: guild, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
    if (data.NextUpdate < Date.now()) {
        data.NextUpdate = new Date().setHours(24, 0, 0, 0);
        data.Day += 1;
    }
    data.save();
}

const getday = global.getday = async function() {
    let guild = client.guild;
    let data = await TIMES.findOne({ guildID: guild}).exec().then((document) => {
        if (!document) {
            new TIMES({ guidID: guild, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
            return 1;
        }
        else {
            return document.Day;
        }
    });
    return data;
}

const getduration = global.getduration = function(ms) {
    return Date.now() - ms;
};


const voiceinit = global.voiceinit = async function(memberID, parentID, duration) {
            let data = await StatModel.findOne({ guildID: client.guild, userID: memberID });
            if (!data) {
                let voiceMap = new Map();
                let chatMap = new Map();
                voiceMap.set(parentID, duration);
                let newMember = new StatModel({
                    guildID: client.guild,
                    userID: memberID,
                    voiceStats: voiceMap,
                    totalVoiceStats: duration,
                    lifeVoiceStats: voiceMap,
                    lifeTotalVoiceStats: duration,
                    lifeChatStats: chatMap,
                    lifeTotalChatStats: 0,
                    allVoice: {},
                    allMessage: {},
                    allVoiceCategory: {},
                    chatStats: chatMap,
                    totalChatStats: 0,
                });
                await newMember.save();
            } else {
                let lastUserData = data.voiceStats.get(parentID) || 0;
                let lastLifeData = data.lifeVoiceStats.get(parentID) || 0;
                data.voiceStats.set(parentID, Number(lastUserData) + duration);
                data.lifeVoiceStats.set(parentID, Number(lastLifeData) + duration);
                data.totalVoiceStats = Number(data.totalVoiceStats) + duration;
                data.lifeTotalVoiceStats = Number(data.lifeTotalVoiceStats) + duration;
                await data.save();
            }
        }

/**
 * @param {String} id 
 * @param {String} channel 
 * @param {Number} value 
 */
const dayupdate = global.dayupdate = async function(id, channel, value) {
        let days = await getday(client.guild);
        let kategori = client.guilds.cache.get(client.guild).channels.cache.get(channel);
        if (kategori && kategori.parentId) {
            await StatModel.updateOne(
                { userID: id, guildID: client.guild },
                { $inc: { [`allVoice.${days}.${channel}`]: value, [`allVoiceCategory.${days}.${kategori.parentId}`]: value } }
            );
        } else {
            await StatModel.updateOne(
                { userID: id, guildID: client.guild },
                { $inc: { [`allVoice.${days}.${channel}`]: value } }
            );
                }
};

/**
 * @param {client} client
 * @param {Array} options
 */
const chatguard = global.chatguard = function(client, options) {
    new CHAT(client, options);
}