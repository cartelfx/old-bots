module.exports = {
    bots: {
        moderator: {
            token: '',
            dir: './libs/apps/moderator'
        },
        invite: {
            token: '',
            dir: './libs/apps/invite'
        }
    },

    database: {
        host: "127.0.0.1",
        port: 27017,
        db: "cartelfx",
    },

    bot_options: {
        prefixes: ['c!', '!', '.'],
        status: {
            text: "Ready to moderate!",
            type: "Listening"
        }
    },

    guild: {
        id: '1270317714786881588'
    }
}