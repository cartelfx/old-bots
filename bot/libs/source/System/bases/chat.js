const { Client, Collection, EmbedBuilder, Message } = require('discord.js');
const Embed = require('../../Core/Embed');
const vision = require('@google-cloud/vision');
/*const clientfx = new vision.ImageAnnotatorClient({
    keyFilename: '../../source/System/bases/nsfw.json'
});*/

module.exports = class CHAT {
    /**
     * @param {Client} client 
     * @param {Object} options 
     */
    constructor(client, options) {
        this.client = client;
        this.options = options;
        //CHAT GUARD
        this.uyarilar = new Collection();

        if (this.options.küfür) this.kufur();
        if (this.options.link) this.link();
        if (this.options.caps) this.caps();
        if (this.options.spam) this.spam();
        //this.nsfw();
    }

    
    /**
     * 
     * @param {Message} message 
     * @param {String} reason 
     */
    uyar(message, reason) {
        if(!message.guild || message.member.user.bot || message.channel.type != 0) return;
        const user = message.author.id;
        if(message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
        if (!this.uyarilar.has(user)) {
            this.uyarilar.set(user, []);
        }

        const now = Date.now();
        const warnings = this.uyarilar.get(user);

        warnings.push({ time: now, reason });
        const recentWarnings = warnings.filter(w => now - w.time < 20000);
        message.delete();
        if (recentWarnings.length >= 5) {
            message.member.timeout(10 * 60 * 1000, reason)
                .then(() => message.channel.send({ embeds: [ new Embed().author(message.member.user.username, message.member.user.avatarURL()).description(`${message.author}, sohbet limitlerini aştığınızdan dolayı **10 dakika** boyunca uzaklaştırıldınız.`)]}))
            this.uyarilar.delete(user);
        } else {
            this.uyarilar.set(user, recentWarnings);
            message.channel.send({ embeds: [
                new Embed().author(message.member.user.username, message.member.user.avatarURL()).description(`${message.author}, ${reason}.`)
            ]}).then(x => setTimeout(() => {
                x.delete();
            }, 3000))
        }
    }

    kufur() {
        this.client.on('messageCreate', (message) => {
            const terbiyesizinsanlarinkullandigikelimelerqwlşklkşk = ['abaza', 'abazan', 'ag', 'ağzına sıçayım', 'ahmak', 'allah', 'allahsız', 'am', 'amarım', 'ambiti', 'am biti', 'amcığı ', 'amcığın', 'amcığını', 'amcığınızı', 'amcık', 'amcık hoşafı', 'amcıklama', 'amcıklandı', 'amcik', 'amck', 'amckl', 'amcklama', 'amcklaryla', 'amckta', 'amcktan', 'amcuk', 'amık', 'amına', 'amınako', 'amına koy', 'amına koyarım', 'amına koyayım', 'amınakoyim', 'amına koyyim', 'amına s', 'amına sikem', 'amına sokam', 'amın feryadı', 'amını', 'amını s', 'amın oglu', 'amınoğlu', 'amın oğlu', 'amısına', 'amısını', 'amina', 'amina g', 'amina k', 'aminako', 'aminakoyarim', 'amina koyarim', 'amina koyayım', 'amina koyayim', 'aminakoyim', 'aminda', 'amindan', 'amindayken', 'amini', 'aminiyarraaniskiim', 'aminoglu', 'amin oglu', 'amiyum', 'amk', 'amkafa', 'amk çocuğu', 'amlarnzn', 'amlı', 'amm', 'ammak', 'ammna', 'amn', 'amna', 'amnda', 'amndaki', 'amngtn', 'amnn', 'amona', 'amq', 'amsız', 'amsiz', 'amsz', 'amteri', 'amugaa', 'amuğa', 'amuna', 'ana', 'anaaann', 'anal', 'analarn', 'anam', 'anamla', 'anan', 'anana', 'anandan', 'ananı', 'ananı ', 'ananın', 'ananın am', 'ananın amı', 'ananın dölü', 'ananınki', 'ananısikerim', 'ananı sikerim', 'ananısikeyim', 'ananı sikeyim', 'ananızın', 'ananızın am', 'anani', 'ananin', 'ananisikerim', 'anani sikerim', 'ananisikeyim', 'anani sikeyim', 'anann', 'ananz', 'anas', 'anasını', 'anasının am', 'anası orospu', 'anasi', 'anasinin', 'anay', 'anayin', 'angut', 'anneni', 'annenin', 'annesiz', 'anuna', 'aptal', 'aq', 'a.q', 'a.q.', 'aq.', 'ass', 'atkafası', 'atmık', 'attırdığım', 'attrrm', 'auzlu', 'avrat', 'ayklarmalrmsikerim', 'azdım', 'azdır', 'azdırıcı', 'babaannesi kaşar', 'babanı', 'babanın', 'babani', 'babası pezevenk', 'bacağına sıçayım', 'bacına', 'bacını', 'bacının', 'bacini', 'bacn', 'bacndan', 'bacy', 'bastard', 'basur', 'beyinsiz', 'bızır', 'bitch', 'biting', 'bok', 'boka', 'bokbok', 'bokça', 'bokhu', 'bokkkumu', 'boklar', 'boktan', 'boku', 'bokubokuna', 'bokum', 'bombok', 'boner', 'bosalmak', 'boşalmak', 'cenabet', 'cibiliyetsiz', 'cibilliyetini', 'cibilliyetsiz', 'cif', 'cikar', 'cim', 'çük', 'dalaksız', 'dallama', 'daltassak', 'dalyarak', 'dalyarrak', 'dangalak', 'dassagi', 'diktim', 'dildo', 'dingil', 'dingilini', 'dinsiz', 'dkerim', 'domal', 'domalan', 'domaldı', 'domaldın', 'domalık', 'domalıyor', 'domalmak', 'domalmış', 'domalsın', 'domalt', 'domaltarak', 'domaltıp', 'domaltır', 'domaltırım', 'domaltip', 'domaltmak', 'dölü', 'dönek', 'düdük', 'eben', 'ebeni', 'ebenin', 'ebeninki', 'ebleh', 'ecdadını', 'ecdadini', 'embesil', 'emi', 'fahise', 'fahişe', 'feriştah', 'ferre', 'fuck', 'fucker', 'fuckin', 'fucking', 'gavad', 'gavat', 'geber', 'geberik', 'gebermek', 'gebermiş', 'gebertir', 'gerızekalı', 'gerizekalı', 'gerizekali', 'gerzek', 'giberim', 'giberler', 'gibis', 'gibiş', 'gibmek', 'gibtiler', 'goddamn', 'godoş', 'godumun', 'gotelek', 'gotlalesi', 'gotlu', 'gotten', 'gotundeki', 'gotunden', 'gotune', 'gotunu', 'gotveren', 'goyiim', 'goyum', 'goyuyim', 'goyyim', 'göt', 'göt deliği', 'götelek', 'göt herif', 'götlalesi', 'götlek', 'götoğlanı', 'göt oğlanı', 'götoş', 'götten', 'götü', 'götün', 'götüne', 'götünekoyim', 'götüne koyim', 'götünü', 'götveren', 'göt veren', 'göt verir', 'gtelek', 'gtn', 'gtnde', 'gtnden', 'gtne', 'gtten', 'gtveren', 'hasiktir', 'hassikome', 'hassiktir', 'has siktir', 'hassittir', 'haysiyetsiz', 'hayvan herif', 'hoşafı', 'hödük', 'hsktr', 'huur', 'ıbnelık', 'ibina', 'ibine', 'ibinenin', 'ibne', 'ibnedir', 'ibneleri', 'ibnelik', 'ibnelri', 'ibneni', 'ibnenin', 'ibnerator', 'ibnesi', 'idiot', 'idiyot', 'imansz', 'ipne', 'iserim', 'işerim', 'itoğlu it', 'kafam girsin', 'kafasız', 'kafasiz', 'kahpe', 'kahpenin', 'kahpenin feryadı', 'kaka', 'kaltak', 'kancık', 'kancik', 'kappe', 'karhane', 'kaşar', 'kavat', 'kavatn', 'kaypak', 'kayyum', 'kerane', 'kerhane', 'kerhanelerde', 'kevase', 'kevaşe', 'kevvase', 'koca göt', 'koduğmun', 'koduğmunun', 'kodumun', 'kodumunun', 'koduumun', 'koyarm', 'koyayım', 'koyiim', 'koyiiym', 'koyim', 'koyum', 'koyyim', 'krar', 'kukudaym', 'laciye boyadım', 'lavuk', 'liboş', 'madafaka', 'mal', 'malafat', 'malak', 'manyak', 'mcik', 'meme', 'memelerini', 'mezveleli', 'minaamcık', 'mincikliyim', 'mna', 'monakkoluyum', 'motherfucker', 'mudik', 'oc', 'ocuu', 'ocuun', 'OÇ', 'oç', 'o. çocuğu', 'oğlan', 'oğlancı', 'oğlu it', 'orosbucocuu', 'orospu', 'orospucocugu', 'orospu cocugu', 'orospu çoc', 'orospuçocuğu', 'orospu çocuğu', 'orospu çocuğudur', 'orospu çocukları', 'orospudur', 'orospular', 'orospunun', 'orospunun evladı', 'orospuydu', 'orospuyuz', 'orostoban', 'orostopol', 'orrospu', 'oruspu', 'oruspuçocuğu', 'oruspu çocuğu', 'osbir', 'ossurduum', 'ossurmak', 'ossuruk', 'osur', 'osurduu', 'osuruk', 'osururum', 'otuzbir', 'öküz', 'öşex', 'patlak zar', 'penis', 'pezevek', 'pezeven', 'pezeveng', 'pezevengi', 'pezevengin evladı', 'pezevenk', 'pezo', 'pic', 'pici', 'picler', 'piç', 'piçin oğlu', 'piç kurusu', 'piçler', 'pipi', 'pipiş', 'pisliktir', 'porno', 'pussy', 'puşt', 'puşttur', 'rahminde', 'revizyonist', 's1kerim', 's1kerm', 's1krm', 'sakso', 'saksofon', 'salaak', 'salak', 'saxo', 'sekis', 'serefsiz', 'sevgi koyarım', 'sevişelim', 'sexs', 'sıçarım', 'sıçtığım', 'sıecem', 'sicarsin', 'sie', 'sik', 'sikdi', 'sikdiğim', 'sike', 'sikecem', 'sikem', 'siken', 'sikenin', 'siker', 'sikerim', 'sikerler', 'sikersin', 'sikertir', 'sikertmek', 'sikesen', 'sikesicenin', 'sikey', 'sikeydim', 'sikeyim', 'sikeym', 'siki', 'sikicem', 'sikici', 'sikien', 'sikienler', 'sikiiim', 'sikiiimmm', 'sikiim', 'sikiir', 'sikiirken', 'sikik', 'sikil', 'sikildiini', 'sikilesice', 'sikilmi', 'sikilmie', 'sikilmis', 'sikilmiş', 'sikilsin', 'sikim', 'sikimde', 'sikimden', 'sikime', 'sikimi', 'sikimiin', 'sikimin', 'sikimle', 'sikimsonik', 'sikimtrak', 'sikin', 'sikinde', 'sikinden', 'sikine', 'sikini', 'sikip', 'sikis', 'sikisek', 'sikisen', 'sikish', 'sikismis', 'sikiş', 'sikişen', 'sikişme', 'sikitiin', 'sikiyim', 'sikiym', 'sikiyorum', 'sikkim', 'sikko', 'sikleri', 'sikleriii', 'sikli', 'sikm', 'sikmek', 'sikmem', 'sikmiler', 'sikmisligim', 'siksem', 'sikseydin', 'sikseyidin', 'siksin', 'siksinbaya', 'siksinler', 'siksiz', 'siksok', 'siksz', 'sikt', 'sikti', 'siktigimin', 'siktigiminin', 'siktiğim', 'siktiğimin', 'siktiğiminin', 'siktii', 'siktiim', 'siktiimin', 'siktiiminin', 'siktiler', 'siktim', 'siktim ', 'siktimin', 'siktiminin', 'siktir', 'siktir et', 'siktirgit', 'siktir git', 'siktirir', 'siktiririm', 'siktiriyor', 'siktir lan', 'siktirolgit', 'siktir ol git', 'sittimin', 'sittir', 'skcem', 'skecem', 'skem', 'sker', 'skerim', 'skerm', 'skeyim', 'skiim', 'skik', 'skim', 'skime', 'skmek', 'sksin', 'sksn', 'sksz', 'sktiimin', 'sktrr', 'skyim', 'slaleni', 'sokam', 'sokarım', 'sokarim', 'sokarm', 'sokarmkoduumun', 'sokayım', 'sokaym', 'sokiim', 'soktuğumunun', 'sokuk', 'sokum', 'sokuş', 'sokuyum', 'soxum', 'sulaleni', 'sülaleni', 'sülalenizi', 'sürtük', 'şerefsiz', 'şıllık', 'taaklarn', 'taaklarna', 'tarrakimin', 'tasak', 'tassak', 'taşak', 'taşşak', 'tipini s.k', 'tipinizi s.keyim', 'tiyniyat', 'toplarm', 'topsun', 'totoş', 'vajina', 'vajinanı', 'veled', 'veledizina', 'veled i zina', 'verdiimin', 'weled', 'weledizina', 'whore', 'xikeyim', 'yaaraaa', 'yalama', 'yalarım', 'yalarun', 'yaraaam', 'yarak', 'yaraksız', 'yaraktr', 'yaram', 'yaraminbasi', 'yaramn', 'yararmorospunun', 'yarra', 'yarraaaa', 'yarraak', 'yarraam', 'yarraamı', 'yarragi', 'yarragimi', 'yarragina', 'yarragindan', 'yarragm', 'yarrağ', 'yarrağım', 'yarrağımı', 'yarraimin', 'yarrak', 'yarram', 'yarramin', 'yarraminbaşı', 'yarramn', 'yarran', 'yarrana', 'yarrrak', 'yavak', 'yavş', 'yavşak', 'yavşaktır', 'yavuşak', 'yılışık', 'yilisik', 'yogurtlayam', 'yoğurtlayam', 'yrrak', 'zıkkımım', 'zibidi', 'zigsin', 'zikeyim', 'zikiiim', 'zikiim', 'zikik', 'zikim', 'ziksiiin', 'ziksiin', 'zulliyetini', 'zviyetini'];
            if (terbiyesizinsanlarinkullandigikelimelerqwlşklkşk.some(kufur => message.content.toLowerCase().includes(kufur))) {

                this.uyar(message, 'Küfür kullanamazsınız.');
            }
        });
    }

    link() {
        this.client.on('messageCreate', (message) => {
            const linkPattern = /(https?:\/\/[^\s]+)/g;
            if (linkPattern.test(message.content)) {
                this.uyar(message, 'Bağlantı paylaşamazsınız.');
            }
        });
    }

    caps() {
        this.client.on('messageCreate', (message) => {
            const capsRate = message.content.replace(/[^A-Z]/g, '').length / message.content.length;
            if (capsRate > 0.7) {
                this.uyar(message, 'Fazla büyük harf kullanamazsınız.');
            }
        });
    }

    spam() {
        const userMessages = new Map();
        
        this.client.on('messageCreate', (message) => {
            const user = message.author.id;
            if (!userMessages.has(user)) {
                userMessages.set(user, []);
            }

            const now = Date.now();
            const timestamps = userMessages.get(user);
            timestamps.push(now);

            const spamThreshold = 5;
            const timeLimit = 3000;

            if (timestamps.filter(timestamp => now - timestamp < timeLimit).length >= spamThreshold) {
                this.uyar(message, 'Spam yapamazsınız.');
            }

            userMessages.set(user, timestamps.filter(timestamp => now - timestamp < timeLimit));
        });
    }
}