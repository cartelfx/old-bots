const mongodb = require('mongoose');

module.exports = mongodb.model('statmodel', new mongodb.Schema({
    guildID: String,
    userID: String,
    voiceStats: {type: Map, default: new Map()},
    chatStats: {type: Map, default: new Map()},
    voiceCameraStats: {type: Map, default: new Map()},
    voiceStreamingStats: {type: Map, default: new Map()},
    totalVoiceStats: {type: Number, default: 0},
    totalChatStats: {type: Number, default: 0},
    totalStreamStats: {type: Number, default: 0},
    totalCameraStats: {type: Number, default: 0},
    allVoice: { type: Object, default: {} },
    allMessage: { type: Object, default: {} },
    allVoiceCategory: { type: Object, default: {} },
    lifeVoiceStats: {type: Map, default: new Map()},
    lifeChatStats: {type: Map, default: new Map()},
    lifeTotalChatStats: {type: Number, default: 0},
    lifeTotalVoiceStats: {type: Number, default: 0},
}))