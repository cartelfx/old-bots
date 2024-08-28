const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const path = require('path');
const { STRUCTURE } = require('./Client');

module.exports = class Handler {
    /**
     * @param {STRUCTURE} client 
     */
    constructor(client) {
        this.client = client;
    }

    async events() {
        const eventpath = path.resolve(__dirname, '../', '../apps', this.client.name, 'events');
    
        const getevents = async (dir, dirs = []) => {
            const files = await readdir(dir, { withFileTypes: true });
            const eventFiles = await Promise.all(
                files.map(async (file) => {
                    const fullPath = path.join(dir, file.name);
                    if (file.isFile() && file.name.endsWith('.js')) {
                        return fullPath;
                    } else if (file.isDirectory()) {
                        dirs.push(fullPath);
                        return getevents(fullPath);
                    }
                })
            );
            return eventFiles.flat().filter(Boolean);
        };

        const dirs = [];
        const eventFiles = await getevents(eventpath, dirs);
        this.client.logger.log(`${dirs.length} event directories loaded.`, 'event');
    
        await Promise.all(
            eventFiles.map(async (file) => {
                const EventClass = require(file);
                const eventInstance = new EventClass(this.client);
    
                this.client.on(eventInstance.name, (...args) => eventInstance.event(...args));
    
                delete require.cache[require.resolve(file)];
            })
        );
    }
    
    async commands() {
        const commandsPath = path.resolve(__dirname, '../', '../apps', this.client.name, 'app');
    
        const getcommands = async (dir, dirs = []) => {
            const files = await readdir(dir, { withFileTypes: true });
            let commandFiles = files.filter(file => file.isFile() && file.name.endsWith('.js'))
                                    .map(file => path.join(dir, file.name));
    
            const subdirs = files.filter(file => file.isDirectory());
            for (const subdir of subdirs) {
                const subdirPath = path.join(dir, subdir.name);
                dirs.push(subdirPath);
                const subdirFiles = await getcommands(subdirPath, dirs);
                commandFiles = commandFiles.concat(subdirFiles);
            }
    
            return commandFiles;
        };
    
        const dirs = [];
        const commandFiles = await getcommands(commandsPath, dirs);
    
        this.client.logger.log(`${dirs.length} command directories loaded.`, 'category');
    
        commandFiles.forEach(file => {
            const CommandClass = require(file);
            const commandInstance = new CommandClass(this.client, {
                name: path.basename(file, '.js'), 
                aliases: [],
                usage: '',
                category: ''
            });
    
            commandInstance.load(this.client);
            this.client.commands.set(commandInstance.name, commandInstance);
    
            commandInstance.aliases.forEach(alias => {
                this.client.aliases.set(alias, commandInstance);
            });
    
            delete require.cache[require.resolve(file)];
        });
    }

}