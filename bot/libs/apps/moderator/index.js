const { STRUCTURE } = require("../../source/Core/Client");
const { SELF } = require("../../source/Core/Self");

const client = global.client = new STRUCTURE({
    name: 'moderator',
    token: config.bots.moderator.token,
    database: {
        host: config.database.host,
        port: config.database.port,
        db: config.database.db,
    },
    prefixes: config.bot_options.prefixes,
    rooters: [
        '719117042904727635',
    ],
    adapters: {
        commands: true,
        events: true,
    },
    guild: config.guild.id
})


chatguard(client, {
    küfür: true,
    link: true,
    caps: true,
    spam: true
});

client.initialize();