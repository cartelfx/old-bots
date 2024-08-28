const { IEvent } = require('../../../../source/Structures/BaseEvent');
const { Collection, VoiceState } = require('discord.js');
const Voices = new Collection();
const statRecords = new Collection();

module.exports = class VoiceStateUpdate extends IEvent {
    constructor(client) {
        super(client);
        this.name = 'voiceStateUpdate';
    }

    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async event(oldState, newState) {
        if (!oldState.member || !newState.member || oldState.member.user.bot || newState.member.user.bot) return;

        if (oldState.channelId !== newState.channelId && newState.channelId) {
            await checkjoin(newState);
        }

        if (!oldState.channelId && newState.channelId) {
            Voices.set(newState.id, {
                Time: Date.now(),
                ChannelID: newState.channelId
            });

            const channel = newState.guild.channels.cache?.get(newState.channelId);
            const channelId = channel?.parentId || newState.channelId;

            if (channelId) {
                statRecords.set(newState.id, {
                    channel: channelId,
                    duration: Date.now()
                });
            }
        }

        if (!Voices.has(newState.id)) {
            Voices.set(newState.id, {
                Time: Date.now(),
                ChannelID: (oldState.channelId || newState.channelId)
            });
        }

        let data = statRecords.get(newState.id);
        let duration = data ? getduration(data.duration) : 0;

        if (oldState.channelId && !newState.channelId) {
            let datacik = Voices.get(newState.id);
            if (datacik) {
                Voices.delete(newState.id);
                let durationtwo = Date.now() - datacik.Time;
                dayupdate(newState.id, datacik.ChannelID, durationtwo);
            }
            if (data?.channel) {
                voiceinit(newState.id, data.channel, duration);
            }
            statRecords.delete(newState.id);
        } else if (oldState.channelId && newState.channelId) {
            let datacik = Voices.get(newState.id);
            if (datacik) {
                Voices.set(newState.id, {
                    Time: Date.now(),
                    ChannelID: newState.channelId
                });
                let durationtwo = Date.now() - datacik.Time;
                dayupdate(newState.id, datacik.ChannelID, durationtwo);
            }
            if (data?.channel) {
                voiceinit(newState.id, data.channel, duration);
            }

            const channel = newState.guild.channels.cache?.get(newState.channelId);
            const channelId = channel?.parentId || newState.channelId;

            if (channelId) {
                statRecords.set(newState.id, {
                    channel: channelId,
                    duration: Date.now()
                });
            }
        }
    }
}