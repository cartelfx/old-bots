const { Invite } = require('discord.js');
const { IEvent } = require('../../../../source/Structures/BaseEvent');

module.exports = class InviteCreate extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'inviteCreate';
    }

    /**
     * @param {Invite} invite 
     */
    async event(invite) {
        invite.guild.invites.fetch().then((serverinvs) => {
            const invites = new Discord.Collection();
            serverinvs.map((inv) => {
              invites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
            });
            client.invites.set(invite.guild.id, invites);
          });
        this.client.logger.log(`${this.client.users.cache.get(invite.inviter.id).username} tarafından ${invite.code} daveti oluşturuldu, davet sisteme tanımlandı!`, "log");
    }
};