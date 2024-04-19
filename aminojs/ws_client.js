let WebSocket = require("ws");
let helpers = require("./util/helpers");

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

class Callbacks{
	constructor(debug=false){
		this.debug=debug;
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
	#resolve_chat_message(self, data){
        let key = `${data['o']['chatMessage']['type']}:${data['o']['chatMessage']['mediaType']??0}`;
        return (self.chat_methods[key]??self.default)(data);
    }
    #resolve_chat_action_start(self, data){
        let key = data['o']['actions']??0;
        return (self.chat_actions_start[key]??self.default)(data);
    }

    #resolve_chat_action_end(self, data){
        let key = data['o']['actions']??0;
        return (self.chat_actions_end[key]??self.default)(data);
    }
    resolve(data){
    	data=JSON.parse(data);
    	if (this.methods[data["t"]]) this.methods[data["t"]](this, data);
    	else if (this.debug) console.log(JSON.stringify(data));
    }
    on_text_message(data, call_back=(data)=>data){call_back(data);}
    on_image_message(data, call_back=(data)=>data){call_back(data);}
    on_youtube_message(data, call_back=(data)=>data){call_back(data);}
    on_strike_message(data, call_back=(data)=>data){call_back(data);}
    on_voice_message(data, call_back=(data)=>data){call_back(data);}
    on_sticker_message(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_not_answered(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_not_cancelled(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_not_declined(data, call_back=(data)=>data){call_back(data);}
    on_video_chat_not_answered(data, call_back=(data)=>data){call_back(data);}
    on_video_chat_not_cancelled(data, call_back=(data)=>data){call_back(data);}
    on_video_chat_not_declined(data, call_back=(data)=>data){call_back(data);}
    on_avatar_chat_not_answered(data, call_back=(data)=>data){call_back(data);}
    on_avatar_chat_not_cancelled(data, call_back=(data)=>data){call_back(data);}
    on_avatar_chat_not_declined(data, call_back=(data)=>data){call_back(data);}
    on_delete_message(data, call_back=(data)=>data){call_back(data);}
    on_group_member_join(data, call_back=(data)=>data){call_back(data);}
    on_group_member_leave(data, call_back=(data)=>data){call_back(data);}
    on_chat_invite(data, call_back=(data)=>data){call_back(data);}
    on_chat_background_changed(data, call_back=(data)=>data){call_back(data);}
    on_chat_title_changed(data, call_back=(data)=>data){call_back(data);}
    on_chat_icon_changed(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_start(data, call_back=(data)=>data){call_back(data);}
    on_video_chat_start(data, call_back=(data)=>data){call_back(data);}
    on_avatar_chat_start(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_end(data, call_back=(data)=>data){call_back(data);}
    on_video_chat_end(data, call_back=(data)=>data){call_back(data);}
    on_avatar_chat_end(data, call_back=(data)=>data){call_back(data);}
    on_chat_content_changed(data, call_back=(data)=>data){call_back(data);}
    on_screen_room_start(data, call_back=(data)=>data){call_back(data);}
    on_screen_room_end(data, call_back=(data)=>data){call_back(data);}
    on_chat_host_transfered(data, call_back=(data)=>data){call_back(data);}
    on_text_message_force_removed(data, call_back=(data)=>data){call_back(data);}
    on_chat_removed_message(data, call_back=(data)=>data){call_back(data);}
    on_text_message_removed_by_admin(data, call_back=(data)=>data){call_back(data);}
    on_chat_tip(data, call_back=(data)=>data){call_back(data);}
    on_chat_pin_announcement(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_permission_open_to_everyone(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_permission_invited_and_requested(data, call_back=(data)=>data){call_back(data);}
    on_voice_chat_permission_invite_only(data, call_back=(data)=>data){call_back(data);}
    on_chat_view_only_enabled(data, call_back=(data)=>data){call_back(data);}
    on_chat_view_only_disabled(data, call_back=(data)=>data){call_back(data);}
    on_chat_unpin_announcement(data, call_back=(data)=>data){call_back(data);}
    on_chat_tipping_enabled(data, call_back=(data)=>data){call_back(data);}
    on_chat_tipping_disabled(data, call_back=(data)=>data){call_back(data);}
    on_timestamp_message(data, call_back=(data)=>data){call_back(data);}
    on_welcome_message(data, call_back=(data)=>data){call_back(data);}
    on_invite_message(data, call_back=(data)=>data){call_back(data);}
    on_user_typing_start(data, call_back=(data)=>data){call_back(data);}
    on_user_typing_end(data, call_back=(data)=>data){call_back(data);}
    default(data, call_back=(data)=>data){call_back(data);}
};

class SocketHandler {
    constructor(client, debug = false) {
        this.api = "wss://ws1.narvii.com";
        this.session = client.session;
        this.reconnectTime = 180;
        this.debug=debug;
    }
    async start(callbacks=null){
        this.callbacks=callbacks??(new Callbacks(this.debug));
    	await this.reconnect_handler();
    }
    async reconnect_handler() {
        let f=async function(self){
            while (true) {
	            self.run_amino_socket();
	            await sleep(self.reconnectTime);
        	}
        }
        await f(this);
    }
    async handle_message(self, data) {
    	data=String(data);
    	if (this.debug) console.log(`[WS | Message], ${data}`);
    	self.callbacks.resolve(data);
    }
    async send(data) {
        this.ws.send(data);
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
                if (this.debug) if (e) console.log(e);
            })
        })
        this.ws.on('message', (data)=>{this.handle_message(this, data)});
    }
    async close() {
        this.ws.terminate();
    }
};

module.exports = {
    SocketHandler,
    Callbacks
};