class IEvent {
    constructor(client) {
        this.client = client;
        this.name = '';
    }

    async event(...args) {

    }
}

module.exports = { IEvent };