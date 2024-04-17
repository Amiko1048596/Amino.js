const helpers=require('./helpers.js');

class Session{
	constructor(sid=null, auid=null, deviceId=null, userAgent=null){
		this.sid=sid;
		this.auid=auid;
		this.deviceId=deviceId;
	}
};
		
class ApisHeaders{
	constructor(session=null, data=null, deviceId=null, type=null, sig=null){
		this.headers={
			"Accept-Language": "en-US",
            "Content-Type": "application/x-www-form-urlencoded",
			"AUID": helpers.uuid4(),
            "User-Agent": "Apple iPhone14,2 iOS v16.3 Main/3.22.0",
			"Connection": "Keep-Alive",
            "Host": "service.aminoapps.com",
            "Accept-Encoding": "gzip",
		};
		if(data){
			this.headers["Content-Type"]="application/json; charset=utf-8";
			this.headers["Content-Length"]=`${data}`.length;
			this.headers["NDC-MSG-SIG"]=helpers.signature(data);
		}
		if(type) this.headers["Content-Type"]=type;
		if(deviceId) this.headers["NDCDEVICEID"]=deviceId;
		if(sig) this.headers["NDC-MSG-SIG"]=sig;
		if(session){
			if(session.sid) this.headers["NDCAUTH"]=`sid=${session.sid}`;
			if(session.auid) this.headers["AUID"]=session.auid;
			if(session.deviceId) this.headers["NDCDEVICEID"]=session.deviceId;
		}
	}
};

class TapJoy{
	constructor(userId=null){
		this.data = {
            "reward": {
                "ad_unit_id": "t00_tapjoy_android_master_checkinwallet_rewardedvideo_322",
                "credentials_type": "publisher",
                "custom_json": {
                    "hashed_user_id": userId
                },
                "demand_type": "sdk_bidding",
                "event_id": helpers.uuid4(),
                "network": "tapjoy",
                "placement_tag": "default",
                "reward_name": "Amino Coin",
                "reward_valid": true,
                "reward_value": 2,
                "shared_id": "4d7cc3d9-8c8a-4036-965c-60c091e90e7b",
                "version_id": "1569147951493",
                "waterfall_id": "4d7cc3d9-8c8a-4036-965c-60c091e90e7b"
            },
            "app": {
                "bundle_id": "com.narvii.amino.master",
                "current_orientation": "portrait",
                "release_version": "3.4.33585",
                "user_agent": "Dalvik\/2.1.0 (Linux; U; Android 10; G8231 Build\/41.2.A.0.219; com.narvii.amino.master\/3.4.33567)"
            },
            "device_user": {
                "country": "US",
                "device": {
                    "architecture": "aarch64",
                    "carrier": {
                        "country_code": 255,
                        "name": "Vodafone",
                        "network_code": 0
                    },
                    "is_phone": true,
                    "model": "GT-S5360",
                    "model_type": "Samsung",
                    "operating_system": "android",
                    "operating_system_version": "29",
                    "screen_size": {
                        "height": 2300,
                        "resolution": 2.625,
                        "width": 1080
                    }
                },
                "do_not_track": false,
                "idfa": "0c26b7c3-4801-4815-a155-50e0e6c27eeb",
                "ip_address": "",
                "locale": "ru",
                "timezone": {
                    "location": "Asia\/Seoul",
                    "offset": "GMT+02:00"
                },
                "volume_enabled": true
            },
            "session_id": "7fe1956a-6184-4b59-8682-04ff31e24bc0",
            "date_created": 1633283996
        }
	}
	headers(){
		return {
				"cookies": "__cfduid=d0c98f07df2594b5f4aad802942cae1f01619569096",
				"authorization": "Basic NWJiNTM0OWUxYzlkNDQwMDA2NzUwNjgwOmM0ZDJmYmIxLTVlYjItNDM5MC05MDk3LTkxZjlmMjQ5NDI4OA==",
				"X-Tapdaq-SDK-Version": "android-sdk_7.1.1",
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 9 Pro Build/QQ3A.200805.001; com.narvii.amino.master/3.4.33585)"
		};
	}
};

module.exports={
	Session, ApisHeaders, TapJoy
};
