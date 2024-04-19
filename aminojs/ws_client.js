let WebSocket = require("ws");
let helpers = require("./util/helpers");

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

class Callbacks {
    constructor(debug = false) {
        this.debug = debug;
        this.methods = {
            "304": this.#resolve_chat_action_start,
            "306": this.#resolve_chat_action_end,
            "1000": this.#resolve_chat_message,
        };

        this.chat_methods = {
            "0:0": this.on_text_message,
            "0:100": this.on_image_message,
            "0:103": this.on_youtube_message,
            "1:0": this.on_strike_message,
            "2:110": this.on_voice_message,
            "3:113": this.on_sticker_message,
            "52:0": this.on_voice_chat_not_answered,
            "53:0": this.on_voice_chat_not_cancelled,
            "54:0": this.on_voice_chat_not_declined,
            "55:0": this.on_video_chat_not_answered,
            "56:0": this.on_video_chat_not_cancelled,
            "57:0": this.on_video_chat_not_declined,
            "58:0": this.on_avatar_chat_not_answered,
            "59:0": this.on_avatar_chat_not_cancelled,
            "60:0": this.on_avatar_chat_not_declined,
            "100:0": this.on_delete_message,
            "101:0": this.on_group_member_join,
            "102:0": this.on_group_member_leave,
            "103:0": this.on_chat_invite,
            "104:0": this.on_chat_background_changed,
            "105:0": this.on_chat_title_changed,
            "106:0": this.on_chat_icon_changed,
            "107:0": this.on_voice_chat_start,
            "108:0": this.on_video_chat_start,
            "109:0": this.on_avatar_chat_start,
            "110:0": this.on_voice_chat_end,
            "111:0": this.on_video_chat_end,
            "112:0": this.on_avatar_chat_end,
            "113:0": this.on_chat_content_changed,
            "114:0": this.on_screen_room_start,
            "115:0": this.on_screen_room_end,
            "116:0": this.on_chat_host_transfered,
            "117:0": this.on_text_message_force_removed,
            "118:0": this.on_chat_removed_message,
            "119:0": this.on_text_message_removed_by_admin,
            "120:0": this.on_chat_tip,
            "121:0": this.on_chat_pin_announcement,
            "122:0": this.on_voice_chat_permission_open_to_everyone,
            "123:0": this.on_voice_chat_permission_invited_and_requested,
            "124:0": this.on_voice_chat_permission_invite_only,
            "125:0": this.on_chat_view_only_enabled,
            "126:0": this.on_chat_view_only_disabled,
            "127:0": this.on_chat_unpin_announcement,
            "128:0": this.on_chat_tipping_enabled,
            "129:0": this.on_chat_tipping_disabled,
            "65281:0": this.on_timestamp_message,
            "65282:0": this.on_welcome_message,
            "65283:0": this.on_invite_message,
        };

        this.chat_actions_start = {
            "Typing": this.on_user_typing_start,
        };

        this.chat_actions_end = {
            "Typing": this.on_user_typing_end,
        };
    }
    #resolve_chat_message(self, data) {
        let key = `${data['o']['chatMessage']['type']}:${data['o']['chatMessage']['mediaType']??0}`;
        return (self.chat_methods[key] ?? self.default)(data);
    }
    #resolve_chat_action_start(self, data) {
        let key = data['o']['actions'] ?? 0;
        return (self.chat_actions_start[key] ?? self.default)(data);
    }

    #resolve_chat_action_end(self, data) {
        let key = data['o']['actions'] ?? 0;
        return (self.chat_actions_end[key] ?? self.default)(data);
    }
    resolve(data) {
        data = JSON.parse(data);
        if (this.methods[data["t"]]) this.methods[data["t"]](this, data);
        else if (this.debug) console.log(JSON.stringify(data));
    }
    on_text_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_image_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_youtube_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_strike_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_sticker_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_not_answered(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_not_cancelled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_not_declined(data, call_back = (data) => data) {
        call_back(data);
    }
    on_video_chat_not_answered(data, call_back = (data) => data) {
        call_back(data);
    }
    on_video_chat_not_cancelled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_video_chat_not_declined(data, call_back = (data) => data) {
        call_back(data);
    }
    on_avatar_chat_not_answered(data, call_back = (data) => data) {
        call_back(data);
    }
    on_avatar_chat_not_cancelled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_avatar_chat_not_declined(data, call_back = (data) => data) {
        call_back(data);
    }
    on_delete_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_group_member_join(data, call_back = (data) => data) {
        call_back(data);
    }
    on_group_member_leave(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_invite(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_background_changed(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_title_changed(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_icon_changed(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_start(data, call_back = (data) => data) {
        call_back(data);
    }
    on_video_chat_start(data, call_back = (data) => data) {
        call_back(data);
    }
    on_avatar_chat_start(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_end(data, call_back = (data) => data) {
        call_back(data);
    }
    on_video_chat_end(data, call_back = (data) => data) {
        call_back(data);
    }
    on_avatar_chat_end(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_content_changed(data, call_back = (data) => data) {
        call_back(data);
    }
    on_screen_room_start(data, call_back = (data) => data) {
        call_back(data);
    }
    on_screen_room_end(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_host_transfered(data, call_back = (data) => data) {
        call_back(data);
    }
    on_text_message_force_removed(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_removed_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_text_message_removed_by_admin(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_tip(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_pin_announcement(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_permission_open_to_everyone(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_permission_invited_and_requested(data, call_back = (data) => data) {
        call_back(data);
    }
    on_voice_chat_permission_invite_only(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_view_only_enabled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_view_only_disabled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_unpin_announcement(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_tipping_enabled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_chat_tipping_disabled(data, call_back = (data) => data) {
        call_back(data);
    }
    on_timestamp_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_welcome_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_invite_message(data, call_back = (data) => data) {
        call_back(data);
    }
    on_user_typing_start(data, call_back = (data) => data) {
        call_back(data);
    }
    on_user_typing_end(data, call_back = (data) => data) {
        call_back(data);
    }
    default (data, call_back = (data) => data) {
        call_back(data);
    }
};

class SocketHandler {
    constructor(client, debug = false) {
        this.api = "wss://ws1.narvii.com";
        this.session = client.session;
        this.reconnectTime = 180;
        this.debug = debug;
    }
    async start(callbacks = null) {
        this.callbacks = callbacks ?? (new Callbacks(this.debug));
        await this.reconnect_handler();
    }
    async reconnect_handler() {
        let f = async function(self) {
            while (true) {
                self.run_amino_socket();
                await sleep(self.reconnectTime);
            }
        }
        await f(this);
    }
    async handle_message(self, data) {
        data = String(data);
        if (this.debug) console.log(`[WS | Message], ${data}`);
        self.callbacks.resolve(data);
    }
    async send(data) {
        this.ws.send(JSON.stringify(data));
    }
    async run_amino_socket() {
        let final = `${this.session.deviceId}|${Date.now()}`;
        this.headers = {
            "NDCDEVICEID": this.session.deviceId,
            "NDCAUTH": `sid=${this.session.sid}`,
            "NDC-MSG-SIG": helpers.signature(final),
        };
        let url = `${this.api}/?signbody=${final.replace("|", "%7C")}`;
        this.ws = new WebSocket(url, {
            "headers": this.headers,
        });
        this.ws.on('close', (clx) => {
            if (this.debug) console.log('[WS | CLOSED]', clx)
            try {
                if (this.debug) console.log('[WS | Reconnecting!]')
            } catch (e) {
                if (this.debug) console.log(`[WS | ERROR] ${e}`);
            }
        })
        this.ws.on("open", (x) => {
            if (this.debug) console.log('[WS | Opened]');
        });
        this.ws.on("unexpected-response", (e) => {
            try {
                this.ws.close();
            } catch (e) {
                if (this.debug) console.log(`[WS | ERROR] ${e}`);
            }
        })
        this.ws.on('error', (err) => {
            if (this.debug) console.log('[WS Error]', err)
        })

        this.ws.on("pong", (d) => {
            this.ws.pong("pong", true, (e) => {
                if (this.debug)
                    if (e) console.log(e);
            })
        })
        this.ws.on('message', (data) => {
            this.handle_message(this, data)
        });
    }
    async close() {
        this.ws.terminate();
    }
};

const Action = {
    ACTION_BROWSING: "Browsing",
    ACTION_CHATTING: "Chatting",
    ACTION_COMMENTING: "Commenting",
    ACTION_PLAYING: "Playing",
    ACTION_POLLING: "Polling",
    ACTION_RECORDING: "Recording",
    ACTION_TYPING: "Typing",
    ACTION_VOTING: "Voting",
};

const Channel = {
    CHANNEL_TYPE_NONE: 0,
    CHANNEL_TYPE_AUDIO: 1,
    CHANNEL_TYPE_TEXT: 2,
    CHANNEL_TYPE_AVATAR: 3,
    CHANNEL_TYPE_VIDEO: 4,
    CHANNEL_TYPE_SCREEN_ROOM: 5,
};

const Role = {
    JOIN_ROLE_GUEST: 0,
    JOIN_ROLE_PRESENTER: 1,
    JOIN_ROLE_AUDIENCE: 2,
    JOIN_ROLE_GUEST_AUDIENCE: 3,
};

const Message = {
    COMMUNITY_DISABLED: 1,
    ERROR_MESSAGE: 1,
    CHAT_THREAD_ORGANIZER_LEFT: 2,
    CHAT_THREAD_NOT_AVAILABLE: 3,
    USER_PROFILE_BANNED: 4,
    CHAT_THREAD_MEMBERSHIP_BANNED: 5,
    CHAT_THREAD_NO_PRESENTER: 6,
    CHAT_THREAD_PRIVATE_NOT_ACCEPT: 99,
    JOIN_THREAD_CHANNEL_REQUEST: 100,
    JOIN_THREAD_CHANNEL_RESPONSE: 101,
    THREAD_CHANNEL_USER_LIST_MESSAGE: 102,
    LEAVE_THREAD_CHANNEL_REQUEST: 103,
    LEAVE_THREAD_CHANNEL_RESPONSE: 104,
    FETCH_THREAD_CHANNEL_USER_LIST_REQUEST: 105,
    THREAD_CHANNEL_USER_JOINED_MESSAGE: 106,
    THREAD_CHANNEL_USER_LEFT_MESSAGE: 107,
    UPDATE_THREAD_CHANNEL_REQUEST: 108,
    UPDATE_THREAD_CHANNEL_RESPONSE: 109,
    THREAD_STATUS_CHANGED_MESSAGE: 111,
    UPDATE_USER_ROLE_REQUEST: 112,
    UPDATE_USER_ROLE_RESPONSE: 113,
    THREAD_CHANNEL_USER_STATUS_CHANGED_MESSAGE: 114,
    THREAD_CHANNEL_FORCE_QUIT_MESSAGE: 115,
    THREAD_CHANNEL_USER_PING_REQUEST: 116,
    THREAD_CHANNEL_USER_PING_RESPONSE: 117,
    MULTI_DEVICE_ERROR: 118,
    SCREEN_RROM_PLAY_LIST_RESPONSE: 119,
    UPDATE_PLAY_LIST_REQUEST: 120,
    UPDATE_PLAY_LIST_RESPONSE: 121,
    FETCH_PLAY_LIST_REQUEST: 122,
    FORCE_UPDATE_USER_ROLE_REQ: 126,
    FORCE_UPDATE_USER_ROLE_RESP: 127,
    FORCE_UPDATE_USER_ROLE_MESSAGE: 128,
    THREAD_WAIT_LIST_APPROVE_MESSAGE: 130,
    THREAD_WAIT_LIST_CHANGED_MESSAGE: 131,
    THREAD_WAIT_LIST_CLEAN_REQUEST: 132,
    THREAD_WAIT_LIST_CLEAN_RESPONSE: 133,
    THREAD_WAIT_LIST_JOIN_APPROVE_REQUEST: 134,
    THREAD_WAIT_LIST_JOIN_APPROVE_RESPONSE: 135,
    THREAD_WAIT_LIST_JOIN_CANCEL_REQUEST: 136,
    THREAD_WAIT_LIST_JOIN_CANCEL_RESPENSE: 137,
    THREAD_WAIT_LIST_JOIN_REQUEST: 138,
    THREAD_WAIT_LIST_JOIN_RESPONSE: 139,
    AGORA_TOKEN_REQUEST: 200,
    AGORA_TOKEN_RESPONSE: 201,
    SUBSCRIBE_LIVE_LAYER_REQUEST: 300,
    SUBSCRIBE_LIVE_LAYER_RESPONSE: 301,
    UNSUBSCRIBE_LIVE_LAYER_REQUEST: 302,
    UNSUBSCRIBE_LIVE_LAYER_RESPONSE: 303,
    REPORT_LIVE_LAYER_ACTIVE_REQUEST: 304,
    REPORT_LIVE_LAYER_ACTIVE_RESPONSE: 305,
    REPORT_LIVE_LAYER_INACTIVE_REQUEST: 306,
    REPORT_LIVE_LAYER_INACTIVE_RESPONSE: 307,
    LIVE_LAYER_USER_JOINED_EVENT: 400,
    LIVE_LAYER_USER_LEFT_EVENT: 401,
    CHAT_MESSAGE_DTO: 1000,
    CHAT_MESSAGE_ACK_DTO: 1001,
};

class WSS {
    constructor(client, socket, ndcId = 0, threadId = null, debug = false) {
        if (Object.getPrototypeOf(ndcId).constructor.name == "String") ndcId = Number(ndcId);
        this.ws=socket;
        this.ndcId = ndcId;
        this.threadId = threadId;
        this.timestamp = () => Math.trunc(Number(`${Date.now()/1000}`.slice(3)) - 1000000);
    }
    async send(data){
        await this.ws.send(data);
    }
    async send_remove_from_presenter(userId, joinRole = Role.JOIN_ROLE_AUDIENCE) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "targetUid": userId,
                "id": this.timestamp(),
            },
            "t": Message.FORCE_UPDATE_USER_ROLE_REQ,
        };
        await this.send(data);
    }
    async join_voice_chat(joinRole = Role.JOIN_ROLE_PRESENTER) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_USER_ROLE_REQUEST,
        };
        await this.send(data);
    }
    async join_video_chat(joinRole = Role.JOIN_ROLE_PRESENTER, channelType = Channel.CHANNEL_TYPE_SCREEN_ROOM) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "channelType": channelType,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_THREAD_CHANNEL_REQUEST,
        };
        await this.send(data);
    }
    async join_video_chat_as_viewer(joinRole = Role.JOIN_ROLE_AUDIENCE) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_USER_ROLE_REQUEST,
        };
        await this.send(data);
    }
    async run_vc(joinRole = Role.JOIN_ROLE_PRESENTER) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_USER_ROLE_REQUEST,
        };
        await this.send(data);
    }
    async start_vc(channelType = Channel.CHANNEL_TYPE_AUDIO) {
        await this.run_vc();
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "channelType": channelType,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_THREAD_CHANNEL_REQUEST,
        };
        await this.send(data);
    }
    async end_vc(joinRole = Role.JOIN_ROLE_AUDIENCE) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_USER_ROLE_REQUEST,
        };
        await this.send(data);
    }
    async online() {
        let target = `ndc://x${this.ndcId}/`;
        let data = {
            "o": {
                "actions": [Action.ACTION_BROWSING],
                "target": target,
                "ndcId": this.ndcId,
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_ACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async browsing(blogId = null, blogType = 0) {
        let target;
        if (blogId && blogType) target = `ndc://x${this.ndcId}/blog/${blogId}`;
        else target = `ndc://x${this.ndcId}/featured`;
        let data = {
            "o": {
                "actions": [Action.ACTION_BROWSING],
                "target": target,
                "ndcId": this.ndcId,
                "params": {
                    "blogType": blogType
                },
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_INACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async chatting(threadType = Channel.CHANNEL_TYPE_TEXT) {
        let target = `ndc://x${this.ndcId}/chat-thread/${this.threadId}`;
        let data = {
            "o": {
                "actions": [Action.ACTION_CHATTING],
                "target": target,
                "ndcId": this.ndcId,
                "params": {
                    "duration": 12800,
                    "membershipStatus": 1,
                    "threadType": threadType,
                },
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_INACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async public_chats() {
        let target = `ndc://x${this.ndcId}/public-chats`;
        let data = {
            "o": {
                "actions": [Action.ACTION_BROWSING],
                "target": target,
                "ndcId": this.ndcId,
                "params": {
                    "duration": 859
                },
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_INACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async leader_boards() {
        let target = `ndc://x${this.ndcId}/leaderboards`;
        let data = {
            "o": {
                "actions": [Action.ACTION_BROWSING],
                "target": target,
                "ndcId": this.ndcId,
                "params": {
                    "duration": 859
                },
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_INACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async custom(actions, target, params) {
        let data = {
            "o": {
                "actions": actions,
                "target": target,
                "ndcId": this.ndcId,
                "params": params,
                "id": this.timestamp(),
            },
            "t": Message.REPORT_LIVE_LAYER_INACTIVE_REQUEST,
        };
        await this.send(data);
    }
    async thread_join(joinRole = Role.JOIN_ROLE_PRESENTER) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "joinRole": joinRole,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_USER_ROLE_REQUEST,
        };
        await this.send(data);
    }
    async channel_join(channelType = Channel.CHANNEL_TYPE_SCREEN_ROOM) {
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "channelType": channelType,
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_THREAD_CHANNEL_REQUEST,
        };
        await this.send(data);
    }
    async video_player(path = null, title = null, background = null, duration = 60000) {
        await this.chatting();
        await this.thread_join();
        await this.channel_join();
        let data = {
            "o": {
                "ndcId": this.ndcId,
                "threadId": this.threadId,
                "playlist": {
                    "currentItemIndex": 0,
                    "currentItemStatus": 1,
                    "items": [{
                        "author": null,
                        "duration": duration,
                        "isDone": false,
                        "mediaList": [
                            [100, background, null]
                        ],
                        "title": title,
                        "type": 1,
                        "url": `file://${path}`
                    }]
                },
                "id": this.timestamp(),
            },
            "t": Message.UPDATE_PLAY_LIST_REQUEST,
        };
        await this.send(data);
        data["o"]["playlist"]["currentItemStatus"] = 2;
        data["o"]["playlist"]["items"][0]["isDone"] = true;
        await this.send(data);
    }
}

module.exports = {
    SocketHandler,
    Callbacks,
    Action,
    Channel,
    Role,
    Message,
    WSS,
};