const { Client } = require('discord.js-selfbot-v13');


module.exports = class SELF extends Client {
    constructor(options) {
        super({
            intents: 32767,
            checkUpdate: false
        });

        this.token = options.token || null;
    }

    initialize() {
        if (!this.token) throw new Error('Self token is required.');
        this.login(this.token).then(() => {
            console.log(`Selfbot connected as ${this.user.tag}`);
        })
    }
}