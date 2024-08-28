const { STRUCTURE } = require("../../source/Core/Client");

const client = global.client = new STRUCTURE({
    name: 'invite',
    token: config.bots.invite.token,
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
        commands: false,
        events: true,
    },
    guild: config.guild.id
})

client.invites = new Discord.Collection();

client.initialize();