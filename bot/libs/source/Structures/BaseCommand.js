class ICommand {
    constructor(client, options) {
        if (!options || !options.name) {
            throw new Error('Options object must contain a "name" property.');
        }
        this.client = client;
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.usage = options.usage;
        this.category = options.category;
    }

    async load(client) {}

    async command(client, message, args, embed) {}
}

module.exports = { ICommand };