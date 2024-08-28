const { Client, Message, ActionRowBuilder, RoleSelectMenuBuilder, ComponentType, ChannelSelectMenuBuilder } = require('discord.js');
const { ICommand } = require('../../../../source/Structures/BaseCommand');
const setupSettings = require('../../../../source/System/bases/setup.settings');

module.exports = class Setup extends ICommand {
    constructor(client) {
        super(client, {
            name: 'setup',
            aliases: ['server', 'settings'],
            usage: 'setup',
            category: 'developer'
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
        if(!client.rooters.includes(message.member.id) && (await message.guild.fetchOwner()).id.includes(message.member.id)) return;
        let properties = setupSettings.properties || [];

        const categories = [...new Set(properties.map(p => p.category))];
        const categoryOptions = categories.map(category => ({ label: category, value: category }));

        const ayarMenu = new ActionRowBuilder().addComponents(
            menu({
                id: 'setup_selection',
                placeholder: 'Lütfen aşağıdan seçim yapınız.',
                options: [
                    { label: 'Bot Yönetimi', description: 'Sistemdeki tüm botları yönetmek için kullanılır.', emoji: '1270698109684416533', value: 'botyonetim' },
                    { label: 'Bot Güncelleme', description: 'Sistemdeki tüm botları güncellemek için kullanılır.', emoji: '1270699259435548682', value: 'botgunc' },
                    { label: 'Yedekleme', description: 'Sistemdeki tüm ayarları yedek alır.', emoji: '1270720979022123040', value: 'backup' },
                    { label: 'Yasaklı Tag', description: 'Sunucuda istenmeyen sembolü yasaklamak için kullanılır.', emoji: '1270722610623156254', value: 'yasaktag' },
                    { label: 'Ayarlar', description: 'Sistemdeki tüm ayarları yönetmek için kullanılır.', emoji: '1270482473322545243', value: 'ayarlar' },
                    { label: 'Kanal Kurulumu', description: 'Sisteme gerekli olan log kanallarını kurmak için kullanılır', emoji: '1270723574419951681', value: 'logkurcuk' },
                    { label: 'Emoji Kurulumu', description: 'Sisteme gerekli olan emojileri kurmak için kullanılır.', emoji: '1270721950360141875', value: 'emojikurcuk' },
                ]
            })
        );
        
        const categoryMenu = new ActionRowBuilder().addComponents(
            menu({
                id: 'category_select',
                placeholder: 'Aşağıdan bir kategori seçin!',
                emoji: '1270482473322545243',
                options: categoryOptions
            })
        );
        
        await message.channel.send({
            components: [ayarMenu],
            embeds: [
                embed.description(`${message.guild.name} isimli sunucunun sistem ayarları yönetim ayarları aşağıdaki menüde belirtilmiştir.`)
            ],
        }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
        
            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'setup_selection') {
                    const value = interaction.values[0];
                    if(value === 'botyonetim') {
                        msg.delete();
                        let getcom = client.commands.find((n) => n.name === 'managebots');
                        getcom.command(client, message, args, embed)
                    }
                    if (value === 'ayarlar') {
                        await interaction.update({
                            components: [categoryMenu],
                            embeds: [
                                embed.description('Aşağıdan bir kategori seçin!')
                            ]
                        });
                    }
                } else if (interaction.customId === 'category_select') {
                    const selectedCategory = interaction.values[0];
                    const categoryProperties = properties.filter(p => p.category === selectedCategory);
                    const propertyOptions = categoryProperties.map(prop => ({ label: prop.name, value: prop.name }));
        
                    const propertyMenu = new ActionRowBuilder()
                        .addComponents(
                            menu({
                                id: 'property_select',
                                placeholder: `${selectedCategory} kategorisinden bir ayar seçin!`,
                                options: propertyOptions,
                            })
                        );
        
                    await interaction.update({
                        components: [propertyMenu],
                        embeds: [
                            embed.description(`**${selectedCategory}** kategorisinden bir ayar seçin.`)
                        ],
        }).then(async (msg) => {
                        const filter = (interaction) => interaction.user.id === message.author.id;
                        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

                        collector.on('collect', async (interaction) => {
                            if (interaction.customId === 'property_select') {
                                const property = properties.find(p => p.name === interaction.values[0]);

                                if (!property) return;

                                if (property.type === 'str') {
                                    await interaction.update({
                                        components: [],
                                        embeds: [
                                            embed.description(`**${property.name}** ayarını güncellemek için 30 saniye içinde yeni bir değer girin.`)
                                        ],
                                    });

                                    const filter = (m) => m.author.id === message.author.id;
                                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                                        .then(async (collected) => {
                                            const content = collected.first()?.content;

                                            if (content) {
                                                await ServerModel.findOneAndUpdate(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: content } },
                                                    { upsert: true }
                                                );
                                                message.channel.send({
                                                    embeds: [ embed.description(`**${property.name}** isimli ayar **${content}** olarak güncellendi.`)]
                                                })
                                            } else {
                                                message.channel.send({
                                                     embeds: [embed.description('Geçerli bir içerik girmediniz.')]
                                                })
                                            }
                                        })
                                        .catch(() => {
                                            message.channel.send({
                                                embeds: [embed.description('Süre zaman aşımına uğradı.')]
                                           })
                                        });
                                }

                                if (property.type === 'role') {
                                    const row = new ActionRowBuilder()
                                        .addComponents(
                                            new RoleSelectMenuBuilder()
                                                .setCustomId('rol')
                                                .setPlaceholder('Aşağıdan rol seçin!')
                                                .setMaxValues(1)
                                        );

                                    await interaction.update({
                                        components: [row],
                                        embeds: [
                                           embed.description(`Aşağıdaki menüden **${property.name}** isimli ayarı güncellemek için bir rol seçimi yapınız.`)
                                        ],
                                    }).then(async (msg) => {
                                        const filter = (i) => i.user.id === message.author.id;
                                        const col = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.RoleSelect, max: 1 });

                                        col.on('collect', async (interaction) => {
                                            const rol = interaction.values[0];
                                            if (interaction.customId === 'rol') {
                                                await interaction.deferUpdate();
                                                await msg.edit({
                                                    components: [],
                                                    embeds: [
                                                       embed.description(`**${property.name}** isimli ayar ${message.guild.getrole(rol)} rolüne güncellendi.`)
                                                    ]
                                                });
                                                await ServerModel.updateOne(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: rol } },
                                                    { upsert: true }
                                                  );
                                            }
                                        });
                                    });
                                }

                                if (property.type === 'roles') {
                                    const row = new ActionRowBuilder()
                                        .addComponents(
                                            new RoleSelectMenuBuilder()
                                                .setCustomId('roller')
                                                .setPlaceholder('Aşağıdan rol seçin!')
                                                .setMinValues(1)
                                                .setMaxValues(20)
                                        );

                                    await interaction.update({
                                        components: [row],
                                        embeds: [
                                            embed.description(`Aşağıdaki menüden **${property.name}** isimli ayarı güncellemek için bir rol seçimi yapınız.`)
                                        ],
                                    }).then(async (msg) => {
                                        const filter = (i) => i.user.id === message.author.id;
                                        const col = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.RoleSelect, max: 1 });

                                        col.on('collect', async (interaction) => {
                                            const roller = interaction.values;
                                            if (interaction.customId === 'roller') {
                                                await interaction.deferUpdate();
                                                await msg.edit({
                                                    components: [],
                                                    embeds: [
                                                       embed.description(`**${property.name}** isimli ayar ${roller.map(role => message.guild.roles.cache.find(role2 => role == role2.id)?.toString()).join(", ")} ${roller.length > 1 ? 'rollerine' : 'rolüne'} güncellendi.`)
                                                    ]
                                                });
                                                await ServerModel.updateOne(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: roller } },
                                                    { upsert: true }
                                                );
                                            }
                                        });
                                    });
                                }

                                if (property.type === 'channel') {
                                    const row = new ActionRowBuilder()
                                        .addComponents(
                                            new ChannelSelectMenuBuilder()
                                                .setCustomId('channel')
                                                .setPlaceholder('Aşağıdan kanal seçin!')
                                                .setMaxValues(1)
                                                .addChannelTypes(0, 5)
                                        );

                                    await interaction.update({
                                        components: [row],
                                        embeds: [
                                           embed.description(`Aşağıdaki menüden **${property.name}** isimli ayarı güncellemek için bir kanal seçimi yapınız.`)
                                        ],
                                    }).then(async (msg) => {
                                        const filter = (i) => i.user.id === message.author.id;
                                        const col = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 });

                                        col.on('collect', async (interaction) => {
                                            const channel = interaction.values[0];
                                            if (interaction.customId === 'channel') {
                                                await interaction.deferUpdate();
                                                await msg.edit({
                                                    components: [],
                                                    embeds: [
                                                       embed.description(`**${property.name}** isimli ayar ${message.guild.getchannel(channel)} kanalına güncellendi.`)
                                                    ]
                                                });
                                                await ServerModel.updateOne(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: channel } },
                                                    { upsert: true }
                                                  );
                                            }
                                        });
                                    });
                                }

                                if (property.type === 'channels') {
                                    const row = new ActionRowBuilder()
                                        .addComponents(
                                            new ChannelSelectMenuBuilder()
                                                .setCustomId('channels')
                                                .setPlaceholder('Aşağıdan kanal seçin!')
                                                .setMaxValues(20)
                                                .addChannelTypes(0, 5)
                                        );

                                    await interaction.update({
                                        components: [row],
                                        embeds: [
                                           embed.description(`Aşağıdaki menüden **${property.name}** isimli ayarı güncellemek için bir kanal seçimi yapınız.`)
                                        ],
                                    }).then(async (msg) => {
                                        const filter = (i) => i.user.id === message.author.id;
                                        const col = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 });

                                        col.on('collect', async (interaction) => {
                                            const channel = interaction.values;
                                            if (interaction.customId === 'channels') {
                                                await interaction.deferUpdate();
                                                await msg.edit({
                                                    components: [],
                                                    embeds: [
                                                       embed.description(`**${property.name}** isimli ayar ${channel.map(channell => message.guild.channels.cache.get(channell)?.toString() || '').filter(Boolean).join(", ")} ${channel.length > 1 ? 'kanallarına' : 'kanalına'} güncellendi.`)
                                                    ]
                                                });
                                                await ServerModel.updateOne(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: channel } },
                                                    { upsert: true }
                                                  );
                                            }
                                        });
                                    });
                                }

                                if (property.type === 'category') {
                                    const row = new ActionRowBuilder()
                                        .addComponents(
                                            new ChannelSelectMenuBuilder()
                                                .setCustomId('category')
                                                .setPlaceholder('Aşağıdan kategori seçin!')
                                                .setMaxValues(1)
                                                .addChannelTypes(4)
                                        );

                                    await interaction.update({
                                        components: [row],
                                        embeds: [
                                           embed.description(`Aşağıdaki menüden **${property.name}** isimli ayarı güncellemek için bir kategori seçimi yapınız.`)
                                        ],
                                    }).then(async (msg) => {
                                        const filter = (i) => i.user.id === message.author.id;
                                        const col = await msg.createMessageComponentCollector({ filter, componentType: ComponentType.ChannelSelect, max: 1 });

                                        col.on('collect', async (interaction) => {
                                            const category = interaction.values[0];
                                            if (interaction.customId === 'category') {
                                                await interaction.deferUpdate();
                                                await msg.edit({
                                                    components: [],
                                                    embeds: [
                                                       embed.description(`**${property.name}** isimli ayar ${message.guild.channels.cache.get(category).name} kategorisine güncellendi.`)
                                                    ]
                                                });
                                                await ServerModel.updateOne(
                                                    { serverID: message.guild.id },
                                                    { $set: { [`server.${property.name}`]: category } },
                                                    { upsert: true }
                                                  );
                                            }
                                        });
                                    });
                                }
                            }
                        });

                        collector.on('end', () => { });
                    });
                }
            });

            collector.on('end', () => { });
        });
    }
}