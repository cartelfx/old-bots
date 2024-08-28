const { IEvent } = require('../../../../source/Structures/BaseEvent');

module.exports = class İnviteReady extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'ready';
    }

    async event() {
        client.user.setPresence({
            status: 'idle',
        activities: [{
            name: config.bot_options.status.text,
            type: activitytype(config.bot_options.status.type),
        }]
        })
    }
}