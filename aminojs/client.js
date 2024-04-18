const helpers = require("./util/helpers.js");
const headers = require("./util/headers.js");
const session_logger = require("./util/session_logger.js");
import('node-fetch');

class Client {
    constructor(session = null, deviceId = null) {
        this.api = "https://service.aminoapps.com/api/v1";
        this.stored = (new session_logger.Stored());
        this.stored.load_sessions();
        if (session) this.session = session;
        else {
            this.session = new headers.Session();
            this.session.deviceId = deviceId ?? helpers.gen_deviceId();
        }
    }
    async request(method = "get", url = null, data = null, headers = null) {
        if (data) {
            data["timestamp"] = Date.now();
            data = JSON.stringify(data);
        }
        if (!headers) {
            headers = this.parse_headers(data);
        }
        return new Promise((resolve) => {
            fetch(url, {
                method: `${method}`.toUpperCase(),
                headers: headers,
                body: data,
            }).then(res => res.text()).then(data => {
                try {
                    data = JSON.parse(data);
                    if (data["api:statuscode"] != 0) {
                        console.log(data);
                        throw data;
                    }
                    return resolve(data);
                } catch {
                    console.log(data);
                    throw data;
                }
            }).catch((e) => {
                console.log(e);
                throw e;
            });
        });
    }
    parse_headers(data = null, session = null, deviceId = null, type = null, sig = null) {
        return new headers.ApisHeaders(session = session ?? this.session, data = data, deviceId = deviceId, type = type, sig = sig).headers;
    }
    async login(email, password) {
        if (this.stored.is_stored_session_valid(email)) {
            this.session.sid = this.stored.sessions[email]["sid"];
            this.session.deviceId = this.stored.sessions[email]["deviceId"];
            this.session.auid = this.stored.sessions[email]["auid"];
            return this.session;
        } else {
            let data = {
                "email": email,
                "v": 2,
                "secret": `0 ${password}`,
                "deviceID": this.session.deviceId,
                "clientType": 100,
                "action": "normal",
            };
            let response = (await this.request("post", `${this.api}/g/s/auth/login`, data));
            this.session.sid = response["sid"];
            this.session.auid = response["auid"];
            this.stored.update_sessions(this.stored.create_session(email, this.session.sid, this.session.deviceId, this.session.auid));
            this.stored.write_sessions();
            return response;
        }
    }
    async login_phone(phoneNumber, password) {
        if (this.stored.is_stored_session_valid(phoneNumber)) {
            this.session.sid = this.stored.sessions[phoneNumber]["sid"];
            this.session.deviceId = this.stored.sessions[phoneNumber]["deviceId"];
            this.session.auid = this.stored.sessions[phoneNumber]["auid"];
            return this.session;
        } else {
            let data = {
                "phoneNumber": phoneNumber,
                "v": 2,
                "secret": `0 ${password}`,
                "deviceID": this.session.deviceId,
                "clientType": 100,
                "action": "normal",
            };
            let response = (await this.request("post", `${this.api}/g/s/auth/login`, data));
            this.session.sid = response["sid"];
            this.session.auid = response["auid"];
            this.stored.update_sessions(this.stored.create_session(phoneNumber, this.session.sid, this.session.deviceId, this.session.auid));
            this.stored.write_sessions();
            return response;
        }
    }
    async login_secret(secret) {
        if (this.stored.is_stored_session_valid(secret)) {
            this.session.sid = this.stored.sessions[secret]["sid"];
            this.session.deviceId = this.stored.sessions[secret]["deviceId"];
            this.session.auid = this.stored.sessions[secret]["auid"];
            return this.session;
        } else {
            let data = {
                "v": 2,
                "secret": secret,
                "deviceID": this.session.deviceId,
                "clientType": 100,
                "action": "normal",
            };
            let response = (await this.request("post", `${this.api}/g/s/auth/login`, data));
            this.session.sid = response["sid"];
            this.session.auid = response["auid"];
            this.stored.update_sessions(this.stored.create_session(secret, this.session.sid, this.session.deviceId, this.session.auid));
            this.stored.write_sessions();
            return response;
        }
    }
    async reqister(nickname, email, password, verificationCode, deviceId = null) {
        let data = {
            "secret": `0 ${password}`,
            "deviceID": deviceId,
            "email": email,
            "clientType": 100,
            "nickname": nickname,
            "latitude": 0,
            "longitude": 0,
            "address": None,
            "clientCallbackURL": "narviiapp://relogin",
            "validationContext": {
                "data": {
                    "code": verificationCode
                },
                "type": 1,
                "identity": email
            },
            "type": 1,
            "identity": email,
        };
        return (await this.request("post", `${this.api}/g/s/auth/register`, data));
    }
    async restore(email, password) {
        let data = {
            "secret": `0 ${password}`,
            "deviceID": this.session.deviceId,
            "email": email,
        };
        return (await this.request("post", `${this.api}/g/s/account/delete-request/cancel`, data));
    }
    async logout() {
        let data = {
            "deviceID": this.session.deviceId,
            "clientType": 100,
        };
        return (await this.request("post", `${this.api}/g/s/auth/logout`, data));
    }
    async configure(age, gender) {
        let data = {
            "age": age,
            "gender": gender,
        };
        return (await this.request("post", `${this.api}/g/s/persona/profile/basic`, data));
    }
    async verify(email, code) {
        let data = {
            "validationContext": {
                "type": 1,
                "identity": email,
                "data": {
                    "code": code
                }
            },
            "deviceID": this.session.deviceId,
        };
        return (await this.request("post", `${this.api}/g/s/auth/check-security-validation`, data));
    }
    async request_verify_code(email, resetPassword = false) {
        let data = {
            "identity": email,
            "type": 1,
            "deviceID": this.session.deviceId,
        };
        if (resetPassword) {
            data["level"] = 2;
            data["purpose"] = "reset-password";
        }
        return (await this.request("post", `${this.api}/g/s/auth/request-security-validation`, data));
    }
    async activate_account(email, code) {
        let data = {
            "type": 1,
            "identity": email,
            "data": {
                "code": code
            },
            "deviceID": this.session.deviceId,
        };
        return (await this.request("post", `${this.api}/g/s/auth/activate-email`, data));
    }
    async delete_account(password) {
        let data = {
            "deviceID": this.session.deviceId,
            "secret": `0 ${password}`,
        };
        return (await this.request("post", `${this.api}/g/s/account/delete-request`, data));
    }
    async change_password(email, password, code) {
        let data = {
            "updateSecret": `0 ${password}`,
            "emailValidationContext": {
                "data": {
                    "code": code
                },
                "type": 1,
                "identity": email,
                "level": 2,
                "deviceID": this.session.deviceId,
            },
            "phoneNumberValidationContext": None,
            "deviceID": this.session.deviceId,
        };
        return (await this.request("post", `${this.api}/g/s/auth/reset-password`, data));
    }
    async check_device(deviceId) {
        let data = {
            "deviceID": deviceId,
            "bundleID": "com.narvii.amino.master",
            "clientType": 100,
            "timezone": -((new Date()).getTimezoneOffset()),
            "systemPushEnabled": true,
            "locale": Intl.DateTimeFormat().resolvedOptions().locale,
        };
        return (await this.request("post", `${this.api}/g/s/device`, data));
    }
    async get_account_info() {
        return (await this.request("get", `${this.api}/g/s/account`));
    }
    async upload_media(file, fileType = "image") {
        let data = file;
        return (await this.request("post", `${this.api}/g/s/device`, data, this.parse_headers(data, null, null, fileType == "image" ? "image/jpg" : "audio/aac")));
    }
    async get_eventlog(language = "en") {
        return (await this.request("get", `${this.api}/g/s/eventlog/profile?language=${language}`));
    }
    async sub_clients(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/community/joined?v=1&start=${start}&size=${size}`));
    }
    async sub_clients_profile(start = 0, size = 25) {
        return this.sub_clients(start = start, size = size);
    }
    async get_user_info(userId) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}`));
    }
    async get_chat_threads(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/chat/thread?type=joined-me&start=${start}&size=${size}`));
    }
    async get_chat_thread(threadId) {
        return (await this.request("get", `${this.api}/g/s/chat/thread/${threadId}`));
    }
    async get_chat_users(threadId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/chat/thread/${threadId}/member?start=${start}&size=${size}&type=default&cv=1.2`));
    }
    async join_chat(threadId) {
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/member/${this.session.auid}`));
    }
    async leave_chat(threadId) {
        return (await this.request("delete", `${this.api}/g/s/chat/thread/${threadId}/member/${this.session.auid}`));
    }
    async start_chat(userId, message, title = null, content = null, isGlobal = false, publishToGlobal = false) {
        if (Object.getPrototypeOf(userId).constructor.name == "String") userId = [userId];
        let data = {
            "title": title,
            "inviteeUids": userId,
            "initialMessageContent": message,
            "content": content,
        };
        if (isGlobal) {
            data["type"] = 2;
            data["eventSource"] = "GlobalComposeMenu";
        } else {
            data["type"] = 0;
        }
        if (publishToGlobal) {
            data["publishToGlobal"] = 1;
        } else {
            data["publishToGlobal"] = 0;
        }
        return (await this.request("post", `${this.api}/g/s/chat/thread`, data));
    }
    async invite_to_chat(userId, threadId) {
        if (Object.getPrototypeOf(userId).constructor.name == "String") userId = [userId];
        let data = {
            "uids": userId,
        }
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/member/invite`, data));
    }
    async kick(userId, threadId, allowRejoin = true) {
        if (allowRejoin) allowRejoin = 1;
        else allowRejoin = 0;
        return (await this.request("delete", `${this.api}/g/s/chat/thread/${threadId}/member/${userId}?allowRejoin=${allowRejoin}`));
    }
    async get_chat_messages(threadId, size = 25, pageToken = null) {
        if (pageToken) {
            let url = `${this.api}/g/s/chat/thread/${threadId}/message?v=2&pagingType=t&pageToken=${pageToken}&size=${size}`;
        } else {
            let url = `${this.api}/g/s/chat/thread/${threadId}/message?v=2&pagingType=t&size=${size}`;
        }
        return (await this.request("get", url));
    }
    async get_message_info(threadId, messageId) {
        return (await this.request("get", `${this.api}/g/s/chat/thread/${threadId}/message/${messageId}`));
    }
    async get_community_info(ndcId) {
        return (await this.request("get", `${this.api}/g/s-x${ndcId}/community/info?withInfluencerList=1&withTopicList=true&influencerListOrderStrategy=fansCount`));
    }
    async search_community(aminoId) {
        return (await this.request("get", `${this.api}/g/s/search/amino-id-and-link?q=${aminoId}`));
    }
    async get_user_following(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/joined?start=${start}&size=${size}`));
    }
    async get_user_followers(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/member?start=${start}&size=${size}`));
    }
    async get_user_visitors(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/visitors?start=${start}&size=${size}`));
    }
    async get_blocked_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/block?start=${start}&size=${size}`));
    }
    async get_blog_info(objectId = null, objectType = "blog") {
        let blogId, wikiId, quizId, fileId;
        if (objectType == "blog") blogId = objectId;
        else if (objectType == "wiki") wikiId = objectId;
        else if (objectType == "quiz") quizId = objectId;
        else if (objectType == "file") fileId = objectId;
        if (blogId || quizId) {
            return (await this.request("get", `${this.api}/g/s/blog/${blogId??quizId}`));
        } else if (wikiId) {
            return (await this.request("get", `${this.api}/g/s/item/${wikiId}`));
        } else if (fileId) {
            return (await this.request("get", `${this.api}/g/s/shared-folder/files/${fileId}`));
        }
    }
    async get_blog_comments(objectId = null, objectType = "blog", sorting = "newest", start = 0, size = 25) {
        let blogId, wikiId, quizId, fileId;
        if (objectType == "blog") blogId = objectId;
        else if (objectType == "wiki") wikiId = objectId;
        else if (objectType == "quiz") quizId = objectId;
        else if (objectType == "file") fileId = objectId;
        if (sorting == "newest") sorting = "newest";
        else if (sorting == "oldest") sorting = "oldest";
        else if (sorting == "top") sorting = "vote";
        if (blogId || quizId) {
            return (await this.request("get", `${this.api}/g/s/blog/${blogId??quizId}/comment?sort=${sorting}&start=${start}&size=${size}`));
        } else if (wikiId) {
            return (await this.request("get", `${this.api}/g/s/item/${wikiId}/comment?sort=${sorting}&start=${start}&size=${size}`));
        } else if (fileId) {
            return (await this.request("get", `${this.api}/g/s/shared-folder/files/${fileId}/comment?sort=${sorting}&start=${start}&size=${size}`));
        }
    }
    async get_blocker_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/block/full-list?start=${start}&size=${size}`));
    }
    async get_wall_comments(userId, sorting, start = 0, size = 25) {
        if (sorting == "newest") sorting = "newest";
        else if (sorting == "oldest") sorting = "oldest";
        else if (sorting == "top") sorting = "vote";
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/g-comment?sort=${sorting}&start=${start}&size=${size}`));
    }
    async flag(reason, flagType, objectId = null, objectType = "blog", asGuest = false) {
        let blogId, wikiId, userId;
        if (objectType == "blog") blogId = objectId;
        else if (objectType == "wiki") wikiId = objectId;
        else if (objectType == "user") userId = objectId;
        let data = {
            "flagType": flagType,
            "message": reason,
        };
        if (userId) {
            data["objectId"] = userId;
            data["objectType"] = 0;
        } else if (blogId) {
            data["objectId"] = blogId;
            data["objectType"] = 1;
        } else if (wikiId) {
            data["objectId"] = wikiId;
            data["objectType"] = 2;
        }
        let flg;
        if (asGuest) flg = "g-flag";
        else flg = "flag";
        return (await this.request("post", `${this.api}/g/s/${flg}`, data));
    }
    async send_message(threadId, message = null, messageType = 0, file = null, fileType = null, replyTo = null, mentionUserIds = null, stickerId = null, embedId = null, embedType = null, embedLink = null, embedTitle = null, embedContent = null, embedImage = null) {
        if (message && file) {
            `${message}`.replaceAll("<$", "‎‏").replace("$>", "‬‭");
        }
        let mentions = [];
        if (mentionUserIds) {
            for (mention_uid of mentionUserIds)
                mentions.push({
                    "uid": mention_uid
                });
        }
        if (embedImage) {
            embedImage = [
                [100, await self.upload_media(embedImage, "image"), null]
            ];
        }
        let data = {
            "type": messageType,
            "content": message,
            "clientRefId": Date.now() / 10000 % 1000000000,
            "attachedObject": {
                "objectId": embedId,
                "objectType": embedType,
                "link": embedLink,
                "title": embedTitle,
                "content": embedContent,
                "mediaList": embedImage
            },
            "extensions": {
                "mentionedArray": mentions
            },
        };
        if (replyTo) data["replyMessageId"] = replyTo;
        if (stickerId) {
            data["content"] = None;
            data["stickerId"] = stickerId;
            data["type"] = 3;
        }
        if (file) {
            data["content"] = null;
            if (fileType == "audio") {
                data["type"] = 2;
                data["mediaType"] = 110;
            } else if (fileType == "image") {
                data["mediaType"] = 100;
                data["mediaUploadValueContentType"] = "image/jpg";
                data["mediaUhqEnabled"] = true;
            } else if (fileType == "gif") {
                data["mediaType"] = 100;
                data["mediaUploadValueContentType"] = "image/gif";
                data["mediaUhqEnabled"] = true;
            }
            data["mediaUploadValue"] = (new TextEncoder()).encode(file, "base64");
        }
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/message`, data));
    }
    async delete_message(threadId, messageId, asStaff = false, reason = null) {
        let data = {
            "adminOpName": 102,
            "adminOpNote": {
                "content": reason
            },
        };
        if (!asStaff) return (await this.request("delete", `${this.api}/g/s/chat/thread/${threadId}/message/${messageId}`));
        else return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/message/${messageId}/admin`, data));
    }
    async mark_as_read(threadId, messageId) {
        let data = {
            "messageId": messageId,
        };
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/mark-as-read`, data));
    }
    async edit_chat(threadId, doNotDisturb = null, pinChat = null, title = null, icon = null, backgroundImage = null, content = null, announcement = null, coHosts = null, keywords = null, pinAnnouncement = null, publishToGlobal = null, canTip = null, viewOnly = null, canInvite = null, fansOnly = null) {
        let data = {};
        data["extensions"] = {};
        if (title) data["title"] = title;
        if (content) data["content"] = content;
        if (icon) data["icon"] = icon;
        if (keywords) data["keywords"] = keywords;
        if (announcement) data["extensions"]["announcement"] = announcement;
        if (pinAnnouncement) data["extensions"]["pinAnnouncement"] = pinAnnouncement;
        if (fansOnly) data["extensions"]["fansOnly"] = fansOnly;
        if (publishToGlobal) data["publishToGlobal"] = 0;
        else data["publishToGlobal"] = 1;
        let responses = [];
        if (doNotDisturb != null) {
            if (doNotDisturb) {
                let additionalData = {
                    "alertOption": 2,
                };
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/member/${this.session.auid}/alert`, additionalData)));
            } else {
                let additionalData = {
                    "alertOption": 1,
                };
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/member/${this.session.auid}/alert`, additionalData)));
            }
        }
        if (pinChat != null) {
            if (pinChat) {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/pin`)));
            } else {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/unpin`)));
            }
        }
        if (backgroundImage) {
            let additionalData = {
                "media": [100, await this.upload_media(backgroundImage, "image"), null],
            };
            responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/member/${this.session.auid}/background`, additionalData)));
        }
        if (coHosts) {
            let additionalData = {
                "uidList": coHosts,
            };
            responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/co-host`, additionalData)));
        }
        if (viewOnly != null) {
            if (viewOnly) {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/view-only/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/view-only/disable`)));
            }
        }
        if (canInvite != null) {
            if (canInvite) {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/members-can-invite/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/members-can-invite/disable`)));
            }
        }
        if (canTip != null) {
            if (canTip) {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/tipping-perm-status/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/tipping-perm-status/disable`)));
            }
        }
        responses.push((await this.request("post", `${this.api}/g/s/chat/thread/${threadId}`, data)));
        return responses;
    }
    async visit(userId) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}?action=visit`));
    }
    async send_coins(coins, blogId = null, chatId = null, objectId = null, transactionId = null) {
        let url;
        if (!transactionId) transactionId = helpers.uuid4();
        let data = {
            "coins": coins,
            "tippingContext": {
                "transactionId": transactionId
            },
        };
        if (blogId) url = `${this.api}/g/s/blog/${blogId}/tipping`;
        if (chatId) url = `${this.api}/g/s/chat/thread/${chatId}/tipping`;
        if (objectId) {
            data["objectId"] = objectId;
            data["objectType"] = 2;
            url = `${this.api}/g/s/tipping`;
        }
        return (await this.request("post", url, data));
    }
    async follow(userId) {
        if (Object.getPrototypeOf(userId).constructor.name == "String") {
            return (await this.request("post", `${this.api}/g/s/user-profile/${userId}/member`));
        } else {
            let data = {
                "targetUidList": userId,
            };
            return (await this.request("post", `${this.api}/g/s/user-profile/${this.session.auid}/joined`, data));
        }
    }
    async unfollow(userId) {
        return (await this.request("delete", `${this.api}/g/s/user-profile/${userId}/member/${this.session.auid}`));
    }
    async block(userId) {
        return (await this.request("post", `${this.api}/g/s/block/${userId}`));
    }
    async unblock(userId) {
        return (await this.request("delete", `${this.api}/g/s/block/${userId}`));
    }
    async join_community(ndcId, invitationCode = null) {
        let data = {};
        if (invitationCode) data["invitationId"] = await this.link_identify(invitationCode);
        return (await this.request("post", `${this.api}/x${ndcId}/s/community/join`, data));
    }
    async request_join_community(ndcId, message = null) {
        let data = {
            "message": message,
        };
        return (await this.request("post", `${this.api}/x${ndcId}/s/community/membership-request`, data));
    }
    async leave_community(ndcId) {
        return (await this.request("post", `${this.api}/x${ndcId}/s/community/leave`));
    }
    async flag_community(ndcId, reason, flagType, isGuest = false) {
        let data = {
            "objectId": ndcId,
            "objectType": 16,
            "flagType": flagType,
            "message": reason,
        };
        let flg;
        if (isGuest) flg = "g-flag";
        else flg = "flag";
        return (await this.request("post", `${this.api}/x${ndcId}/s/${flg}`, data));
    }
    async edit_profile(nickname = null, content = null, icon = null, backgroundColor = null, backgroundImage = null, defaultBubbleId = null, fileType = "image") {
        let data = {
            "address": null,
            "latitude": 0,
            "longitude": 0,
            "mediaList": null,
            "eventSource": "UserProfileView",
            "extensions": {
                "style": {},
            },
        };
        if (nickname) data["nickname"] = nickname;
        if (icon) data["icon"] = await this.upload_media(icon, fileType);
        if (content) data["content"] = content;
        if (backgroundColor) data["extensions"]["style"]["backgroundColor"] = backgroundColor;
        if (backgroundImage) data["extensions"]["style"]["backgroundMediaList"] = [
            [100, backgroundImage, null, null, null]
        ];
        if (defaultBubbleId) data["extensions"]["defaultBubbleId"] = defaultBubbleId;
        return (await this.request("post", `${this.api}/g/s/user-profile/${this.session.auid}`, data));
    }
    async set_privacy_status(isAnonymous = false, getNotifications = false) {
        let data = {};
        if (isAnonymous) data["privacyMode"] = 2;
        else data["privacyMode"] = 1;
        if (getNotifications) data["notificationStatus"] = 1;
        else data["notificationStatus"] = 2;
        return (await this.request("post", `${this.api}/g/s/account/visit-settings`, data));
    }
    async set_amino_id(aminoId) {
        let data = {
            "aminoId": aminoId,
        };
        return (await this.request("post", `${this.api}/g/s/account/change-amino-id`, data));
    }
    async get_linked_communities(userId) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/linked-community`));
    }
    async get_unlinked_communities(userId) {
        return (await this.request("get", `${this.api}/g/s/user-profile/${userId}/linked-community`));
    }
    async reorder_linked_communities(ndcIds) {
        let data = {
            "ndcIds": ndcIds,
        };
        return (await this.request("post", `${this.api}/g/s/user-profile/${this.session.auid}/linked-community/reorder`, data));
    }
    async add_linked_community(ndcId) {
        return (await this.request("post", `${this.api}/g/s/user-profile/${this.session.auid}/linked-community/${ndcId}`));
    }
    async remove_linked_community() {
        return (await this.request("delete", `${this.api}/g/s/user-profile/${this.session.auid}/linked-community/${ndcId}`));
    }
    async comment(message, userId = null, blogId = null, wikiId = null, replyTo = null) {
        let data = {
            "content": message,
            "stickerId": null,
            "type": 0,
        };
        if (replyTo) data["respondTo"] = replyTo;
        if (userId) {
            data["eventSource"] = "UserProfileView";
            return (await this.request("post", `${this.api}/g/s/user-profile/${userId}/g-comment"`, data));
        } else if (blogId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/g/s/blog/${blogId}/g-comment`, data));
        } else if (wikiId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/g/s/item/${wikiId}/g-comment`, data));
        }
    }
    async delete_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let url;
        if (userId) url = `${this.api}/g/s/user-profile/${userId}/g-comment/${commentId}`;
        if (blogId) url = `${this.api}/g/s/blog/${blogId}/g-comment/${commentId}`;
        if (wikiId) url = `${this.api}/g/s/item/${wikiId}/g-comment/${commentId}`;
        return (await this.request("delete", url));
    }
    async like_blog(blogId = null, wikiId = null) {
        let data = {
            "value": 4,
        };
        if (blogId) {
            if (Object.getPrototypeOf(blogId).constructor.name == "String") {
                data["eventSource"] = "UserProfileView";
                return (await this.request("post", `${this.api}/g/s/blog/${blogId}/g-vote?cv=1.2`, data));
            } else {
                data["targetIdList"] = blogId;
                return (await this.request("post", `${this.api}/g/s/feed/g-vote`, data));
            }
        } else if (wikiId) {
            if (Object.getPrototypeOf(wikiId).constructor.name == "String") {
                data["eventSource"] = "PostDetailView";
                return (await this.request("post", `${this.api}/g/s/item/${wikiId}/g-vote?cv=1.2`, data));
            }
        }
    }
    async unlike_blog(blogId = null, wikiId = null) {
        let url;
        if (blogId) url = `${this.api}/g/s/blog/${blogId}/g-vote?eventSource=UserProfileView`;
        if (wikiId) url = `${this.api}/g/s/item/${wikiId}/g-vote?eventSource=PostDetailView`;
        return (await this.request("delete", url));
    }
    async like_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let data = {
            "value": 4,
        };
        if (userId) {
            data["eventSource"] = "UserProfileView";
            return (await this.request("post", `${this.api}/g/s/user-profile/${userId}/comment/${commentId}/g-vote?cv=1.2&value=1`, data));
        } else if (blogId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/g/s/blog/${blogId}/comment/${commentId}/g-vote?cv=1.2&value=1`, data));
        } else if (wikiId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/g/s/item/${wikiId}/comment/${commentId}/g-vote?cv=1.2&value=1`, data));
        }
    }
    async unlike_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let url;
        if (userId) url = `${this.api}/g/s/user-profile/${userId}/comment/${commentId}/g-vote?eventSource=UserProfileView`;
        if (blogId) url = `${this.api}/g/s/blog/${blogId}/comment/${commentId}/g-vote?eventSource=PostDetailView`;
        if (wikiId) url = `${this.api}/g/s/item/${wikiId}/comment/${commentId}/g-vote?eventSource=PostDetailView`;
        return (await this.request("delete", url));
    }
    async get_membership_info() {
        return (await this.request("get", `${this.api}/g/s/membership?force=true`));
    }
    async get_ta_announcements(language = "en", start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/announcement?language=${language}&start=${start}&size=${size}`));
    }
    async get_wallet_info() {
        return (await this.request("get", `${this.api}/g/s/wallet`));
    }
    async get_wallet_history(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/wallet/coin/history?start=${start}&size=${size}`));
    }
    async get_from_deviceid(deviceId) {
        return (await this.request("get", `${this.api}/g/s/auid?deviceId=${deviceId}`));
    }
    async get_from_code(code) {
        return (await this.request("get", `${this.api}/g/s/link-resolution?q=${code}`));
    }
    async get_from_id(objectId, objectType, ndcId = null) {
        let data = {
            "objectId": objectId,
            "targetCode": 1,
            "objectType": objectType,
        };
        let url;
        if (ndcId) url = `${this.api}/g/s-x${ndcId}/link-resolution`;
        else url = `${this.api}/g/s/link-resolution`;
        return (await this.request("post", url, data));
    }
    async get_supported_languages(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/community-collection/supported-languages?start=${start}&size=${size}`));
    }
    async claim_new_user_coupon() {
        return (await this.request("post", `${this.api}/g/s/coupon/new-user-coupon/claim`));
    }
    async get_subscriptions(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/store/subscription?objectType=122&start=${start}&size=${size}`));
    }
    async get_all_users(start = 0, size = 25, type = "recent") {
        return (await this.request("get", `${this.api}/g/s/user-profile?type=${type}&start=${start}&size=${size}`));
    }
    async accept_host(threadId, requestId) {
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/transfer-organizer/${requestId}/accept`));
    }
    async accept_organizer(threadId, requestId) {
        return (await this.accept_host(threadId, requestId));
    }
    async link_identify(code) {
        return (await this.request("get", `${this.api}/g/s/community/link-identify?q=http%3A%2F%2Faminoapps.com%2Finvite%2F${code}`));
    }
    async invite_to_vc(threadId, userId) {
        let data = {
            "uid": userId,
        };
        return (await this.request("post", `${this.api}/g/s/chat/thread/${threadId}/vvchat-presenter/invite`, data));
    }
    async wallet_config(level) {
        let data = {
            "adsLevel": level,
        };
        return (await this.request("post", `${this.api}/g/s/wallet/ads/config`, data));
    }
    async get_avatar_frames(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/g/s/avatar-frame?start=${start}&size=${size}`));
    }
    async subscribe_amino_plus(transactionId = "", sku = "d940cf4a-6cf2-4737-9f3d-655234a92ea5") {
        let data = {
            "sku": sku,
            "packageName": "com.narvii.amino.master",
            "paymentType": 1,
            "paymentContext": {
                "transactionId": transactionId ?? helpers.uuid4(),
                "isAutoRenew": true,
            },
        };
        return (await this.request("post", `${this.api}/g/s/membership/product/subscribe`, data));
    }
    async watch_ad(userId = null) {
        data = headers.Tapjoy(userId ?? this.session.auid).data;
        return (await this.request("post", `https://ads.tapdaq.com/v4/analytics/reward`, data, headers.Tapjoy().headers));
    }
    async purchase(objectId, isAutoRenew = false) {
        let data = {
            "objectId": objectId,
            "objectType": 114,
            "v": 1,
            "paymentContext": {
                "discountStatus": 0,
                "isAutoRenew": isAutoRenew,
            },
        };
        return (await this.request("post", `${this.api}/g/s/store/purchase`, data));
    }
    async get_public_communities(language = "en", size = 25, pageToken = null) {
        let url;
        if (pageToken) url = `${this.api}/g/s/topic/0/feed/community?language=${language}&type=web-explore&categoryKey=recommendation&size=${size}&pagingType=t&pageToken=${pageToken}`;
        else url = `${this.api}/g/s/topic/0/feed/community?language=${language}&type=web-explore&categoryKey=recommendation&size=${size}&pagingType=t`;
        return (await this.request("get", url));
    }
};

module.exports = {
    Client
};