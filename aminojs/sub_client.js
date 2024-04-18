const helpers = require("./util/helpers.js");
const headers = require("./util/headers.js");
const Client = require("./client.js").Client;
import('node-fetch');

class SubClient extends Client {
    constructor(client, ndcId) {
        super(client.session);
        this.ndcId = ndcId;
    }
    async get_invite_codes(status = "normal", start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s-x${this.ndcId}/community/invitation?status=${status}&start=${start}&size=${size}`));
    }
    async generate_invite_code(duration = 0, force = true) {
        let data = {
            "duration": duration,
            "force": force,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s-x${this.ndcId}/community/invitation`, data));
    }
    async delete_invite_code(inviteId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s-x${this.ndcId}/community/invitation/${inviteId}`));
    }
    async post_blog(title, content, imageList = null, captionList = null, categoriesList = null, backgroundColor = null, fansOnly = false, extensions = null) {
        let mediaList = [];
        if (captionList && imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), captionList[i]]);
        else if (imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), null]);
        let data = {
            "address": null,
            "content": content,
            "title": title,
            "mediaList": mediaList,
            "extensions": extensions ?? {
                "style": {

                },
            },
            "latitude": 0,
            "longitude": 0,
            "eventSource": "GlobalComposeMenu",
        };
        if (fansOnly) data["extensions"]["fansOnly"] = fansOnly;
        if (backgroundColor) data["extensions"]["style"]["backgroundColor"] = backgroundColor;
        if (categoriesList) data["taggedBlogCategoryIdList"] = categoriesList;
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog`, data));
    }
    async post_wiki(title, content, icon = null, imageList = null, captionList = null, keywords = null, backgroundColor = null, fansOnly = false, extensions = null) {
        let mediaList = [];
        if (captionList && imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), captionList[i]]);
        else if (imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), null]);
        let data = {
            "label": title,
            "content": content,
            "mediaList": mediaList,
            "extensions": extensions ?? {
                "style": {

                },
            },
            "eventSource": "GlobalComposeMenu",
        };
        if (icon) data["icon"] = icon;
        if (keywords) data["keywords"] = keywords;
        if (fansOnly) data["extensions"]["fansOnly"] = fansOnly;
        if (backgroundColor) data["extensions"]["style"]["backgroundColor"] = backgroundColor;
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/item`, data));
    }
    async edit_blog(blogId, title = null, content = null, imageList = null, captionList = null, categoriesList = null, backgroundColor = null, fansOnly = false, extensions = null) {
        let mediaList = [];
        if (captionList && imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), captionList[i]]);
        else if (imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), null]);
        let data = {
            "address": null,
            "mediaList": mediaList,
            "latitude": 0,
            "longitude": 0,
            "extensions": extensions ?? {
                "style": {

                },
            },
            "eventSource": "PostDetailView",
        };
        if (title) data["title"] = title;
        if (content) data["content"] = content;
        if (fansOnly) data["extensions"]["fansOnly"] = fansOnly;
        if (backgroundColor) data["extensions"]["style"]["backgroundColor"] = backgroundColor;
        if (categoriesList) data["taggedBlogCategoryIdList"] = categoriesList;
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}`, data));
    }
    async delete_blog(blogId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/blog/${blogId}`));
    }
    async delete_wiki(wikiId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/item/${wikiId}`));
    }
    async repost_blog(content = null, blogId = null, wikiId = null) {
        let refObjectId, refObjectType;
        if (blogId) {
            refObjectId = blogId;
            refObjectType = 1;
        } else if (wikiId) {
            refObjectId = wikiId;
            refObjectType = 2;
        }
        let data = {
            "content": content,
            "refObjectId": refObjectId,
            "refObjectType": refObjectType,
            "type": 2,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog`, data));
    }
    async check_in(tz = -((new Date()).getTimezoneOffset())) {
        let data = {
            "timezone": tz,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/check-in`, data));
    }
    async repair_check_in(method = 0) {
        let data = {};
        if (method == 0) data["repairMethod"] = "1"; //Coins
        if (method == 1) data["repairMethod"] = "2"; //Amino+
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/check-in/repair`, data));
    }
    async edit_profile(nickname = null, content = null, icon = null, chatRequestPrivilege = null, imageList = null, captionList = null, backgroundImage = null, backgroundColor = null, titles = null, colors = null, defaultBubbleId = null, fileType = "image") {
        let mediaList = [];
        if (captionList && imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), captionList[i]]);
        else if (imageList)
            for (let i = 0; i < imageList.length; i++)
                mediaList.push([100, await this.upload_media(imageList[i]), null]);
        let data = {
            "extensions": {
                "style": {

                },
            },
        };
        if (mediaList != []) data["mediaList"] = mediaList;
        if (nickname) data["nickname"] = nickname;
        if (icon) data["icon"] = await this.upload_media(icon);
        if (content) data["content"] = content;
        if (chatRequestPrivilege) data["extensions"]["privilegeOfChatInviteRequest"] = chatRequestPrivilege;
        if (backgroundImage) data["extensions"]["style"]["backgroundMediaList"] = [
            [100, backgroundImage, null, null, null]
        ];
        if (backgroundColor) data["extensions"]["style"]["backgroundColor"] = backgroundColor;
        if (defaultBubbleId) data["extensions"]["defaultBubbleId"] = defaultBubbleId;
        if (titles || colors) {
            let tlt = [];
            for (let i = 0; i < titles.length; i++)
                tlt.push({
                    "title": titles[i],
                    "color": colors[i]
                });
            data["extensions"]["customTitles"] = tlt;
        }
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${this.session.auid}`, data));
    }
    async vote_poll(blogId, optionId) {
        let data = {
            "value": 1,
            "eventSource": "PostDetailView",
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/poll/option/${optionId}/vote`, data));
    }
    async comment(message, userId = null, blogId = null, wikiId = null, replyTo = null, isGuest = false) {
        let data = {
            "content": message,
            "stickerId": null,
            "type": 0,
        };
        let comType;
        if (isGuest) comType = "g-comment";
        else comType = "comment";
        if (replyTo) data["respondTo"] = replyTo;
        if (userId) {
            data["eventSource"] = "UserProfileView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/${comType}"`, data));
        } else if (blogId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/${comType}`, data));
        } else if (wikiId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/item/${wikiId}/${comType}`, data));
        }
    }
    async delete_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let url;
        if (userId) url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/g-comment/${commentId}`;
        if (blogId) url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/g-comment/${commentId}`;
        if (wikiId) url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/g-comment/${commentId}`;
        return (await this.request("delete", url));
    }
    async like_blog(blogId = null, wikiId = null) {
        let data = {
            "value": 4,
        };
        if (blogId) {
            if (Object.getPrototypeOf(blogId).constructor.name == "String") {
                data["eventSource"] = "UserProfileView";
                return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/vote?cv=1.2`, data));
            } else {
                data["targetIdList"] = blogId;
                return (await this.request("post", `${this.api}/x${this.ndcId}/s/feed/vote`, data));
            }
        } else if (wikiId) {
            if (Object.getPrototypeOf(wikiId).constructor.name == "String") {
                data["eventSource"] = "PostDetailView";
                return (await this.request("post", `${this.api}/x${this.ndcId}/s/item/${wikiId}/vote?cv=1.2`, data));
            }
        }
    }
    async unlike_blog(blogId = null, wikiId = null) {
        let url;
        if (blogId) url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/g-vote?eventSource=UserProfileView`;
        if (wikiId) url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/g-vote?eventSource=PostDetailView`;
        return (await this.request("delete", url));
    }
    async like_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let data = {
            "value": 4,
        };
        if (userId) {
            data["eventSource"] = "UserProfileView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/comment/${commentId}/vote?cv=1.2&value=1`, data));
        } else if (blogId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/comment/${commentId}/vote?cv=1.2&value=1`, data));
        } else if (wikiId) {
            data["eventSource"] = "PostDetailView";
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/item/${wikiId}/comment/${commentId}/vote?cv=1.2&value=1`, data));
        }
    }
    async unlike_comment(commentId, userId = null, blogId = null, wikiId = null) {
        let url;
        if (userId) url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/comment/${commentId}/g-vote?eventSource=UserProfileView`;
        if (blogId) url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/comment/${commentId}/g-vote?eventSource=PostDetailView`;
        if (wikiId) url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/comment/${commentId}/g-vote?eventSource=PostDetailView`;
        return (await this.request("delete", url));
    }
    async upvote_comment(blogId, commentId) {
        let data = {
            "value": 1,
            "eventSource": "PostDetailView",
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/comment/${commentId}/vote?cv=1.2&value=1`, data));
    }
    async downvote_comment(blogId, commentId) {
        let data = {
            "value": -1,
            "eventSource": "PostDetailView",
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/comment/${commentId}/vote?cv=1.2&value=-1`, data));
    }
    async unvote_comment(blogId, commentId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/blog/${blogId}/comment/${commentId}/vote?eventSource=PostDetailView`));
    }
    async reply_wall(userId, commentId, message) {
        let data = {
            "content": message,
            "stackedId": null,
            "respondTo": commentId,
            "type": 0,
            "eventSource": "UserProfileView",
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/comment`, data));
    }
    async lottery(tz = -((new Date()).getTimezoneOffset())) {
        let data = {
            "timezone": tz,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/check-in/lottery`, data));
    }
    async activity_status(status) {
        if (status == "on") status = 1;
        else if (status == "off") status = 2;
        let data = {
            "onlineStatus": status,
            "duration": 86400,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${this.session.auid}/online-status`, data));
    }
    async check_notifications() {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/notification/checked`));
    }
    async delete_notification(notificationId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/notification/${notificationId}`));
    }
    async clear_notifications() {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/notification`));
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
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread`, data));
    }
    async invite_to_chat(userId, threadId) {
        if (Object.getPrototypeOf(userId).constructor.name == "String") userId = [userId];
        let data = {
            "uids": userId,
        }
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/invite`, data));
    }
    async add_to_favorites(userId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-group/quick-access/${userId}`));
    }
    async send_coins(coins, blogId = null, threadId = null, objectId = null, transactionId = null) {
        let url;
        if (!transactionId) transactionId = helpers.uuid4();
        let data = {
            "coins": coins,
            "tippingContext": {
                "transactionId": transactionId
            },
        };
        if (blogId) url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/tipping`;
        if (threadId) url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/tipping`;
        if (objectId) {
            data["objectId"] = objectId;
            data["objectType"] = 2;
            url = `${this.api}/x${this.ndcId}/s/tipping`;
        }
        return (await this.request("post", url, data));
    }
    async thank_tip(threadId, userId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/tipping/tipped-users/${userId}/thank`));
    }
    async follow(userId) {
        if (Object.getPrototypeOf(userId).constructor.name == "String") {
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/member`));
        } else {
            let data = {
                "targetUidList": userId,
            };
            return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${this.session.auid}/joined`, data));
        }
    }
    async unfollow(userId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/member/${this.session.auid}`));
    }
    async block(userId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/block/${userId}`));
    }
    async unblock(userId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/block/${userId}`));
    }
    async visit(userId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}?action=visit`));
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
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/${flg}`, data));
    }
    async send_message(threadId, message = null, messageType = 0, file = null, fileType = null, replyTo = null, mentionUserIds = null, stickerId = null, embedId = null, embedType = null, embedLink = null, embedTitle = null, embedContent = null, embedImage = null) {
        if (message && file) {
            `${message}`.replaceAll("<$", "‎‏").replace("$>", "‬‭");
        }
        if (mentionUserIds) {
            let mentions = [];
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
            data["content"] = null;
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
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message`, data));
    }
    async full_embed(link, image, message, threadId) {
        let data = {
            "type": 0,
            "content": message,
            "extensions": {
                "linkSnippetList": [{
                    "link": link,
                    "mediaType": 100,
                    "mediaUploadValue": (new TextEncoder()).encode(file, "base64"),
                    "mediaUploadValueContentType": "image/png"
                }]
            },
            "clientRefId": Date.now() / 10000 % 1000000000,
            "attachedObject": null,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message`, data));
    }
    async delete_message(threadId, messageId, asStaff = false, reason = null) {
        let data = {
            "adminOpName": 102,
            "adminOpNote": {
                "content": reason
            },
        };
        if (!asStaff) return (await this.request("delete", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message/${messageId}`));
        else return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message/${messageId}/admin`, data));
    }
    async mark_as_read(threadId, messageId) {
        let data = {
            "messageId": messageId,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/mark-as-read`, data));
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
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${this.session.auid}/alert`, additionalData)));
            } else {
                let additionalData = {
                    "alertOption": 1,
                };
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${this.session.auid}/alert`, additionalData)));
            }
        }
        if (pinChat != null) {
            if (pinChat) {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/pin`)));
            } else {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/unpin`)));
            }
        }
        if (backgroundImage) {
            let additionalData = {
                "media": [100, await this.upload_media(backgroundImage, "image"), null],
            };
            responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${this.session.auid}/background`, additionalData)));
        }
        if (coHosts) {
            let additionalData = {
                "uidList": coHosts,
            };
            responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/co-host`, additionalData)));
        }
        if (viewOnly != null) {
            if (viewOnly) {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/view-only/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/view-only/disable`)));
            }
        }
        if (canInvite != null) {
            if (canInvite) {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/members-can-invite/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/members-can-invite/disable`)));
            }
        }
        if (canTip != null) {
            if (canTip) {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/tipping-perm-status/enable`)));
            } else {
                responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/tipping-perm-status/disable`)));
            }
        }
        responses.push((await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}`, data)));
        return responses;
    }
    async transfer_host(threadId, userIds) {
        let data = {
            "uidList": userIds,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/transfer-organizer`, data));
    }
    async transfer_organizer(threadId, userIds) {
        return await this.transfer_host(threadId, userIds);
    }
    async accept_host(threadId, requestId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/transfer-organizer/${requestId}/accept`));
    }
    async accept_organizer(threadId, requestId) {
        return (await this.accept_host(threadId, requestId));
    }
    async kick(userId, threadId, allowRejoin = true) {
        if (allowRejoin) allowRejoin = 1;
        else allowRejoin = 0;
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${userId}?allowRejoin=${allowRejoin}`));
    }
    async join_chat() {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${this.session.auid}`));
    }
    async leave_chat() {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member/${this.session.auid}`));
    }
    //TODO
    async send_active_obj() {
        let data = {};
        return (await this.request("post", `${this.api}/x${this.ndcId}`, data));
    }
    async delete_chat(threadId) {
        return (await this.request("delete", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}`, data));
    }
    async subscribe(userId, autoRenew = false, transactionId = null) {
        transactionId = transactionId ?? helpers.uuid4();
        let data = {
            "paymentContext": {
                "transactionId": transactionId,
                "isAutoRenew": autoRenew
            },
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/influencer/${userId}/subscribe`, data));
    }
    async promotion(noticeId, type = "accept") {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/notice/${noticeId}/${type}`));
    }
    async play_quiz_raw(quizId, quizAnswerList, quizMode = 0) {
        let data = {
            "mode": quizMode,
            "quizAnswerList": quizAnswerList,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${quizId}/quiz/result`, data));
    }
    async play_quiz(quizId, questionIdsList, answerIdsList, quizMode = 0) {
        let quizAnswerList = [];
        for (let i = 0; i < questionIdsList.length; i++) {
            let answerData = {
                "optIdList": [answerIdsList[i]],
                "quizQuestionId": questionIdsList[i],
                "timeSpent": 0.0
            };
            quizAnswerList.push(answerData);
        }
        let data = {
            "mode": quizMode,
            "quizAnswerList": quizAnswerList,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${quizId}/quiz/result`, data));
    }
    async vc_permission(threadId, permission = 1) {
        /*
		Voice Chat Join Permissions
        1 - Open to Everyone
        2 - Approval Required
        3 - Invite Only
        */
        let data = {
            "vvChatJoinType": permission,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/vvchat-permission`, data));
    }
    async get_vc_reputation_info(threadId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/avchat-reputation`));
    }
    async claim_vc_reputation(threadId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/avchat-reputation`));
    }
    async get_all_users(start = 0, size = 25, type = "recent") {
        // User Types:(recent,banned,featured,leaders,curators,online)
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile?type=${type}&start=${start}&size=${size}`));
    }
    async get_online_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/live-layer?topic=ndtopic:x${this.ndcId}:online-members&start=${start}&size=${size}`));
    }
    async get_online_favorite_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-group/quick-access?type=online&start=${start}&size=${size}`));
    }
    async get_user_info(userId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}`));
    }
    async get_user_following(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/joined?start=${start}&size=${size}`));
    }
    async get_user_followers(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/member?start=${start}&size=${size}`));
    }
    async get_user_visitors(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/visitors?start=${start}&size=${size}`));
    }
    async get_user_checkins(userId, tz = -((new Date()).getTimezoneOffset())) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/check-in/stats/${userId}?timezone=${tz}`));
    }
    async get_user_blogs(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog?type=user&q=${userId}&start=${start}&size=${size}`));
    }
    async get_user_wikis(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/item?type=user-all&start=${start}&size=${size}&cv=1.2&uid=${userId}`));
    }
    async get_user_achievements(userId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/achievements`));
    }
    async get_influencer_fans(userId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/influencer/${userId}/fans?start=${start}&size=${size}`));
    }
    async get_blocked_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/block?start=${start}&size=${size}`));
    }
    async get_blocker_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/block/full-list?start=${start}&size=${size}`));
    }
    async search_users(nickname, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile?type=name&q=${nickname}&start=${start}&size=${size}`));
    }
    async get_saved_blogs(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/bookmark?start=${start}&size=${size}`));
    }
    async get_leaderboard_info(start = 0, size = 25, type = "24") {
        if (type == "24") type = "1";
        if (type == "7") type = "2";
        if (type == "rep") type = "3";
        if (type == "check") type = "4";
        if (type == "quiz") type = "5";
        return (await this.request("get", `${this.api}/g/s-x${this.ndcId}/community/leaderboard?rankingType=${type}&start=${start}&size=${size}`));
    }
    async get_wiki_info(wikiId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/item/${wikiId}`));
    }
    async get_recent_wiki_items(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/item?type=catalog-all&start=${start}&size=${size}`));
    }
    async get_wiki_categories(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/item-category?start=${start}&size=${size}`));
    }
    async get_wiki_category(categoryId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/item-category/${categoryId}?start=${start}&size=${size}`));
    }
    async get_tipped_users(blogId = null, wikiId = null, quizId = null, fileId = null, threadId = null, start = 0, size = 25) {
        let url;
        if (blogId || quizId) url = `${this.api}/x${this.ndcId}/s/blog/${blogId??quizId}/tipping/tipped-users-summary?start=${start}&size=${size}`;
        if (wikiId) url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/tipping/tipped-users-summary?start=${start}&size=${size}`;
        if (threadId) url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/tipping/tipped-users-summary?start=${start}&size=${size}`;
        if (fileId) url = `${this.api}/x${this.ndcId}/s/shared-folder/files/${fileId}/tipping/tipped-users-summary?start=${start}&size=${size}`;
        return (await this.request("get", url));
    }
    async get_chat_threads(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread?type=joined-me&start=${start}&size=${size}`));
    }
    async get_public_chat_threads(start = 0, size = 25, type = "recommended") {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread?type=public-all&filterType=${type}&start=${start}&size=${size}`));
    }
    async get_chat_thread(threadId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}`));
    }
    async get_chat_messages(threadId, size = 25, pageToken = null) {
        let url;
        if (pageToken) url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message?v=2&pagingType=t&pageToken=${pageToken}&size=${size}`;
        else url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message?v=2&pagingType=t&size=${size}`;
        return (await this.request("get", url));
    }
    async get_message_info(threadId, messageId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/message/${messageId}`));
    }
    async get_blog_info(objectId = null, objectType = "blog") {
        let blogId, wikiId, quizId, fileId;
        if (objectType == "blog") blogId = objectId;
        else if (objectType == "wiki") wikiId = objectId;
        else if (objectType == "quiz") quizId = objectId;
        else if (objectType == "file") fileId = objectId;
        if (blogId || quizId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog/${blogId??quizId}`));
        if (wikiId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/item/${wikiId}`));
        if (fileId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/shared-folder/files/${fileId}`));
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
        if (blogId || quizId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog/${blogId??quizId}/comment?sort=${sorting}&start=${start}&size=${size}`));
        if (wikiId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/item/${wikiId}/comment?sort=${sorting}&start=${start}&size=${size}`));
        if (fileId) return (await this.request("get", `${this.api}/x${this.ndcId}/s/shared-folder/files/${fileId}/comment?sort=${sorting}&start=${start}&size=${size}`));
    }
    async get_blog_categories(size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog-category?size=${size}`));
    }
    async get_blogs_by_category(categoryId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog-category/${categoryId}/blog-list?start=${start}&size=${size}`));
    }
    async get_quiz_rankings(quizId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog/${quizId}/quiz/result?start=${start}&size=${size}`));
    }
    async get_wall_comments(userId, sorting, start = 0, size = 25) {
        if (sorting == "newest") sorting = "newest";
        else if (sorting == "oldest") sorting = "oldest";
        else if (sorting == "top") sorting = "vote";
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/g-comment?sort=${sorting}&start=${start}&size=${size}`));
    }
    async get_recent_blogs(start = 0, size = 25, pageToken = null) {
        let url;
        if (pageToken) url = `${this.api}/x${this.ndcId}/s/feed/blog-all?pagingType=t&pageToken=${pageToken}&size=${size}`;
        else url = `${this.api}/x${this.ndcId}/s/feed/blog-all?pagingType=t&start=${start}&size=${size}`;
        return (await this.request("get", url));
    }
    async get_chat_users(threadId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/member?start=${start}&size=${size}&type=default&cv=1.2`));
    }
    async get_notifications(start = 0, size = 25, pageToken = null) {
        let url;
        if (pageToken) url = `${this.api}/x${this.ndcId}/s/notification?pagingType=t&pageToken=${pageToken}&size=${size}`;
        else url = `${this.api}/x${this.ndcId}/s/notification?pagingType=t&start=${start}&size=${size}`;
        return (await this.request("get", url));
    }
    async get_notices(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/notice?type=usersV2&status=1&start=${start}&size=${size}`));
    }
    async get_sticker_pack_info(stickerPackId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/sticker-collection/${stickerPackId}?includeStickers=true`));
    }
    async get_sticker_packs() {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/sticker-collection?includeStickers=false&type=my-active-collection`));
    }
    async get_store_chat_bubbles(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/store/items?sectionGroupId=chat-bubble&start=${start}&size=${size}`));
    }
    async get_store_avatar_frames(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/store/items?sectionGroupId=avatar-frame&start=${start}&size=${size}`));
    }
    async get_store_stickers(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/store/items?sectionGroupId=sticker&start=${start}&size=${size}`));
    }
    async get_community_stickers() {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/sticker-collection?type=community-shared`));
    }
    async get_sticker_collection(collectionId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/sticker-collection/${collectionId}?includeStickers=true`));
    }
    async get_shared_folder_info() {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/shared-folder/stats`));
    }
    async get_shared_folder_files(start = 0, size = 25, type = "latest") {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/shared-folder/files?type=${type}&start=${start}&size=${size}`));
    }
    async moderation_history(userId = null, blogId = null, wikiId = null, quizId = null, fileId = null, start = 0, size = 25, pageToken = null) {
        let url;
        if (pageToken) {
            if (userId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${userId}&objectType=0&pagingType=t&pageToken=${pageToken}&size=${size}`;
            else if (blogId || quizId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${blogId??quizId}&objectType=1&pagingType=t&pageToken=${pageToken}&size=${size}`;
            else if (wikiId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${wikiId}&objectType=2&pagingType=t&pageToken=${pageToken}&size=${size}`;
            else if (fileId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${fileId}&objectType=109&pagingType=t&pageToken=${pageToken}&size=${size}`;
            else url = `${this.api}/x${this.ndcId}/s/admin/operation?pagingType=t&pageToken=${pageToken}&size=${size}`;
        } else {
            if (userId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${userId}&objectType=0&pagingType=t&start=${start}&size=${size}`;
            else if (blogId || quizId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${blogId??quizId}&objectType=1&pagingType=t&start=${start}&size=${size}`;
            else if (wikiId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${wikiId}&objectType=2&pagingType=t&start=${start}&size=${size}`;
            else if (fileId) url = `${this.api}/x${this.ndcId}/s/admin/operation?objectId=${fileId}&objectType=109&pagingType=t&start=${start}&size=${size}`;
            else url = `${this.api}/x${this.ndcId}/s/admin/operation?pagingType=t&start=${start}&size=${size}`;
        }
        return (await this.request("get", url));
    }
    async feature(userId = null, threadId = null, blogId = null, wikiId = null, time = 1) {
        if (threadId) {
            if (time == 1) time = 3600;
            if (time == 2) time = 7200;
            if (time == 3) time = 10800;
        } else {
            if (time == 1) time = 86400;
            if (time == 2) time = 172800;
            if (time == 3) time = 259200;
        }
        let data = {
            "adminOpName": 114,
            "adminOpValue": {
                "featuredDuration": time
            },
        };
        let url;
        if (userId) {
            data["adminOpValue"]["featuredType"] = 4;
            url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/admin`;
        } else if (threadId) {
            data["adminOpValue"]["featuredType"] = 5;
            url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/admin`;
        } else if (blogId) {
            data["adminOpValue"]["featuredType"] = 1;
            url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/admin`;
        } else if (wikiId) {
            data["adminOpValue"]["featuredType"] = 1;
            url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/admin`;
        }
        return (await this.request("post", url, data));
    }
    async unfeature(userId = null, threadId = null, blogId = null, wikiId = null) {
        let data = {
            "adminOpName": 114,
            "adminOpValue": {},
        };
        let url;
        if (userId) {
            data["adminOpValue"]["featuredType"] = 0;
            url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/admin`;
        } else if (threadId) {
            data["adminOpValue"]["featuredType"] = 0;
            url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/admin`;
        } else if (blogId) {
            data["adminOpValue"]["featuredType"] = 0;
            url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/admin`;
        } else if (wikiId) {
            data["adminOpValue"]["featuredType"] = 0;
            url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/admin`;
        }
        return (await this.request("post", `${this.api}/x${this.ndcId}`, data));
    }
    async hide(userId = null, threadId = null, blogId = null, wikiId = null, quizId = null, fileId = null, reason = null) {
        let data = {
            "adminOpNote": {
                "content": reason
            },
        };
        let url;
        if (userId) {
            data["adminOpName"] = 18;
            url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/admin`;
        } else if (blogId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 9;
            url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/admin`;
        } else if (quizId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 9;
            url = `${this.api}/x${this.ndcId}/s/blog/${quizId}/admin`;
        } else if (wikiId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 9;
            url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/admin`;
        } else if (threadId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 9;
            url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/admin`;
        } else if (fileId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 9;
            url = `${this.api}/x${this.ndcId}/s/shared-folder/files/${fileId}/admin`;
        }
        return (await this.request("post", url, data));
    }
    async unhide(userId = null, threadId = null, blogId = null, wikiId = null, quizId = null, fileId = null, reason = null) {
        let data = {
            "adminOpNote": {
                "content": reason
            },
        };
        let url;
        if (userId) {
            data["adminOpName"] = 19;
            url = `${this.api}/x${this.ndcId}/s/user-profile/${userId}/admin`;
        } else if (blogId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 0;
            url = `${this.api}/x${this.ndcId}/s/blog/${blogId}/admin`;
        } else if (quizId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 0;
            url = `${this.api}/x${this.ndcId}/s/blog/${quizId}/admin`;
        } else if (wikiId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 0;
            url = `${this.api}/x${this.ndcId}/s/item/${wikiId}/admin`;
        } else if (threadId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 0;
            url = `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/admin`;
        } else if (fileId) {
            data["adminOpName"] = 110;
            data["adminOpValue"] = 0;
            url = `${this.api}/x${this.ndcId}/s/shared-folder/files/${fileId}/admin`;
        }
        return (await this.request("post", url, data));
    }
    async edit_titles(userId, titles, colors) {
        let tlt = [];
        for (let i = 0; i < titles.length; i++) {
            tlt.push({
                "title": titles[i],
                "color": colors[i],
            });
        }
        let data = {
            "adminOpName": 207,
            "adminOpValue": {
                "titles": tlt
            },
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/admin`, data));
    }
    async warn(userId, reason = null) {
        let data = {
            "uid": userId,
            "title": "Custom",
            "content": reason,
            "attachedObject": {
                "objectId": userId,
                "objectType": 0
            },
            "penaltyType": 0,
            "adminOpNote": {},
            "noticeType": 7,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/notice`, data));
    }
    async strike(userId, time = 1, title = null, reason = null) {
        if (time == 1) time = 3600;
        if (time == 2) time = 10800;
        if (time == 3) time = 21600;
        if (time == 4) time = 43200;
        if (time == 5) time = 86400;
        let data = {
            "uid": userId,
            "title": title,
            "content": reason,
            "attachedObject": {
                "objectId": userId,
                "objectType": 0
            },
            "penaltyType": 1,
            "penaltyValue": time,
            "adminOpNote": {},
            "noticeType": 4,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/notice`, data));
    }
    async ban(userId, reason, banType = null) {
        let data = {
            "reasonType": banType,
            "note": {
                "content": reason,
            },
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/ban`, data));
    }
    async unban(userId, reason) {
        let data = {
            "note": {
                "content": reason,
            },
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/${userId}/unban`, data));
    }
    async reorder_featured_users(userIds) {
        let data = {
            "uidList": userIds,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/user-profile/featured/reorder`, data));
    }
    async get_hidden_blogs(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/feed/blog-disabled?start=${start}&size=${size}`));
    }
    async get_featured_users(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/user-profile?type=featured&start=${start}&size=${size}`));
    }
    async review_quiz_questions(quizId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog/${quizId}?action=review`));
    }
    async get_recent_quiz(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/blog?type=quizzes-recent&start=${start}&size=${size}`));
    }
    async get_trending_quiz(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/feed/quiz-trending?start=${start}&size=${size}`));
    }
    async get_best_quiz(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/feed/quiz-best-quizzes?start=${start}&size=${size}`));
    }
    async purchase(objectId, objectType, aminoPlus = true, autoRenew = false) {
        let data = {
            "objectId": objectId,
            "objectType": objectType,
            "v": 1,
        };
        if (aminoPlus) {
            data['paymentContext'] = {
                'discountStatus': 1,
                'discountValue': 1,
                'isAutoRenew': autoRenew
            };
        } else {
            data['paymentContext'] = {
                'discountStatus': 0,
                'discountValue': 1,
                'isAutoRenew': autoRenew
            };
        }
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/store/purchase`, data));
    }
    async apply_avatar_frame(avatarId, applyToAll = true) {
        let data = {
            "frameId": avatarId,
            "applyToAll": 0,
        };
        if (applyToAll) data["applyToAll"] = 1;
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/avatar-frame/apply`, data));
    }
    async invite_to_vc(threadId, userId) {
        let data = {
            "uid": userId
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/${threadId}/vvchat-presenter/invite`, data));
    }
    async add_poll_option(blogId, question) {
        let data = {
            "mediaList": null,
            "title": question,
            "type": 0,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/blog/${blogId}/poll/option`, data));
    }
    async create_wiki_category(title, parentCategoryId, content = null) {
        let data = {
            "content": content,
            "icon": null,
            "label": title,
            "mediaList": null,
            "parentCategoryId": parentCategoryId,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/item-category`, data));
    }
    async create_shared_folder(title) {
        let data = {
            "title": title,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/shared-folder/folders`, data));
    }
    async submit_to_wiki(wikiId, message) {
        let data = {
            "message": message,
            "itemId": wikiId,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/knowledge-base-request`, data));
    }
    async accept_wiki_request(requestId, destinationCategoryIdList) {
        let data = {
            "destinationCategoryIdList": destinationCategoryIdList,
            "actionType": "create",
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/knowledge-base-request/${requestId}/approve`, data));
    }
    async reject_wiki_request(requestId) {
        let data = {};
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/knowledge-base-request/${requestId}/reject`));
    }
    async get_wiki_submissions(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/knowledge-base-request?type=all&start=${start}&size=${size}`));
    }
    async get_live_layer() {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/live-layer/homepage?v=2`));
    }
    async apply_bubble(bubbleId, threadId, applyToAll = false) {
        let data = {
            "applyToAll": 0,
            "bubbleId": bubbleId,
            "threadId": threadId,
        };
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/thread/apply-bubble`, data));
    }
    async get_blog_users(blogId, start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/live-layer?topic=ndtopic%3Ax${this.ndcId}%3Ausers-browsing-blog-at%3A${blogId}&start=${start}&size=${size}`));
    }
    async get_bubble_info(bubbleId) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/chat-bubble/${bubbleId}`));
    }
    async get_bubble_template_list(start = 0, size = 25) {
        return (await this.request("get", `${this.api}/x${this.ndcId}/s/chat/chat-bubble/templates?start=${start}&size=${size}`));
    }
    async activate_bubble(bubbleId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/chat-bubble/${bubbleId}/activate`));
    }
    async deactivate_bubble(bubbleId) {
        return (await this.request("post", `${this.api}/x${this.ndcId}/s/chat/chat-bubble/${bubbleId}/deactivate`));
    }
};

module.exports = {
    SubClient
};