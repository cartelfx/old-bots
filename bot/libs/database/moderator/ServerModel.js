const mongodb = require('mongoose');

module.exports = mongodb.model('servermodel', new mongodb.Schema({
    _id: { type: String },
    serverID: { type: String, required: true },
    server: { 
        type: Object, 
        default: {
            ServerTag: "",
            UnTag: "•",
            YaşLimit: 14,
            TaglıAlım: false,
            KayıtsızRolleri: [],
            ErkekRolleri: [],
            KadınRolleri: [],
            TeyitçiRolleri: [],
            ChatMuteSorumluları: [],
            VoiceMuteSorumluları: [],
            ŞüpheliRolü: "",
            CezalıRolü: "",
            TaglıRolü: "",
            BoosterRolü: "",
            ChatMuteRolü: "",
            ChatKanalı: "",
            KayıtKanalı: "",
            DavetKanalı: "",
            KomutİzinliKanallar: []
        }
    }
}))