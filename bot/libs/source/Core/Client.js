const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const events = require('events');
config = global.config = require('../System/config');
class STRUCTURE extends Client {
    constructor(opts) {
        super({
            intents: Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[key]),
            partials: Object.keys(Partials).map(key => Partials[key]),
        });

        require('./General');
        require('./Functions');

        this.name = opts.name || 'moderator';
        this.token = opts.token || null;
        this.mongodb = opts.database || null;
        this.prefixes = opts.prefixes || ['.'];
        this.rooters = opts.rooters || [];
        this.adapters = opts.adapters || [];
        this.guild = opts.guild || [];

        // SETUPS
        this.config = global.config = require('../System/config');
        this.replys = global.replys = require('../System/bases/reply');
        this.replys = replys.contents.reduce((acc, item) => {
        acc[item.name] = item.content;
        return acc;
        }, {});
        this.reactions = global.reactions = require('../System/bases/emojis').emojis.reduce((acc, emoji) => {
            acc[emoji.name] = emoji.name;
            return acc;
        }, {});
        // SETUPS
        
        // STRUCTURES 
        this.logger = require('./Console.Logger');
        this.handlers = new (require('./Handlers'))(this);

        if (this.adapters?.commands === true) {
            this.handlers.commands();
        }
        
        if (this.adapters?.events === true) {
            this.handlers.events();
        }
        // STRUCTURES

        // SYSTEMS SET
        this.commands = new Collection();
        this.aliases = new Collection();
        this.extention = new events.EventEmitter();
        // SYSTEMS SET

        // MAPS
        this.wheredatas = new Map();
        // Maps

        // LOGS
        process.on("warning", (warn) => { this.logger.log(warn, "warn") });
        process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
        // LOGS
    }

    initialize() {
        this.logger.log(`Initializing ${this.name}...`, 'log');
        this.logger.log(`Initializing ${this.name} database...`, 'log');
        this.database();
        this.server();
    
        if (!this.token) {
            this.logger.log(`${this.name} no token provided.`, 'error');
            return;
        }
    
        this.login(this.token)
            .then(() => this.logger.log(`${this.name} logged in successfully.`, 'successfully'))
            .catch(err => this.logger.log(`${this.name} login failed.`, 'error'));


            this.on("ready", async () => {
                let guild = await this.guilds.cache.get(this.guild);
                guild.members.fetch().then(() => {
                    this.logger.log(`${guild.memberCount} members have been fetched.`, 'fetched');
                })
            })
    }

    async database() {
        const mongodb = require('mongoose');
        if (!this.mongodb) {
            this.logger.log("No MongoDB URI provided.", "error");
            return;
        }

            await mongodb.connect('mongodb://' + this.mongodb.host + ':' + this.mongodb.port + '/' + this.mongodb.db || 'carteldb', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            this.logger.log("Database connection successful.", "mongodb");
    }

    async server() {
        let server = this.guild;
            await ServerModel.updateOne({ serverID: server }, { $set: { _id: 1 } }, { upsert: true });
            this.logger.log('Server database fetched.', 'log');
            let _get = await ServerModel.findOne({ serverID: server });
            if (_get) {
              this.settings = global.settings = _get.server;
            } else {
              await ServerModel.updateOne({ serverID: server }, { $set: { _id: 1 } }, { upsert: true });
              this.logger.log('Server database fetched.', 'log');
            }
    }

}

module.exports = { STRUCTURE };