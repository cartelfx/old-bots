const Discord = global.Discord = require('discord.js');
const Embed = global.Embed = require('./Embed');
const ServerModel = global.ServerModel = require('../../database/moderator/ServerModel');
const UserModel = global.UserModel = require('../../database/moderator/UserModel');
const StatModel = global.StatModel = require('../../database/stats/StatModel');
const { Guild } = Discord

/**
 * @param {String} identifier
 */
Guild.prototype.getchannel = function(identifier) {
    let kanal = this.channels.cache.find(ch => ch.id === identifier || ch.name === identifier);
    return kanal;
}

/**
 * @param {String} identifier 
 */
Guild.prototype.getrole = function(identifier) {
    let rol = this.roles.cache.find(r => r.id === identifier || r.name === identifier);
    return rol;
}

/**
 * @param {String} identifier
 */
Guild.prototype.getemoji = function(identifier) {
    const emoji = this.emojis.cache.find(e => e.id === identifier || e.name === identifier);
    if (!emoji) return null;
    return emoji;
};