const { IEvent } = require('../../../../source/Structures/BaseEvent');

module.exports = class Ready extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'ready';
    }

    async event() {
        await checkday(client.guild);
        setInterval(async () => {
            await checkday(client.guild);
        }, 5000);
        client.user.setPresence({
            status: 'idle',
        activities: [{
            name: config.bot_options.status.text,
            type: activitytype(config.bot_options.status.type)
        }]
        })
    }
}