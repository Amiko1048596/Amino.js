const helpers=require("./util/helpers.js");
const headers=require("./util/headers.js");
const session_logger=require("./util/session_logger.js");
import('node-fetch');

class Client{
	constructor(deviceId=null){
		this.stored=(new session_logger.Stored());
		this.stored.load_sessions();
		
		this.api="https://service.aminoapps.com/api/v1";
		this.session=new headers.Session();
		this.session.deviceId=deviceId??helpers.gen_deviceId();
	}
	async request(method="get", url=null, headers=null, data=null){
		return new Promise((resolve) => {
			fetch(url, {
				method: `${method}`.toUpperCase(),
				headers: headers,
				body: data,
				}).then(res => res.text()).then(data => {
					try{
						data=JSON.parse(data);
						if(data["api:statuscode"] != 0) {
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
	parse_headers(session=null, data=null, deviceId=null, type=null, sig=null){
		return new headers.ApisHeaders(session=session??this.session, data=data, deviceId=deviceId, type=type, sig=sig).headers;
	}
	async login(email, password){
		if (this.stored.is_stored_session_valid(email)){
			this.session.sid=this.stored.sessions[email]["sid"];
			this.session.deviceId=this.stored.sessions[email]["deviceId"];
			this.session.auid=this.stored.sessions[email]["auid"];
			return this.session;
		} else {
			let data = JSON.stringify({
				"email": email,
				"v": 2,
				"secret": `0 ${password}`,
				"deviceID": this.session.deviceId,
				"clientType": 100,
				"action": "normal",
				"timestamp": Date.now(),
			});
			let response=(await this.request("post", `${this.api}/g/s/auth/login`, this.parse_headers(this.session, data), data));
			this.session.sid=response["sid"];
			this.session.auid=response["auid"];
			this.stored.update_sessions(this.stored.create_session(email, this.session.sid, this.session.deviceId, this.session.auid));
			this.stored.write_sessions();
			return response;
		}
	}
	async login_phone(phoneNumber, password){
		
	}
	async login_secret(secret){
		
	}
	async sub_clients(start=0, size=25){
		return (await this.request("get", `${this.api}/g/s/community/joined?v=1&start=${start}&size=${size}`, this.parse_headers(this.session)));
	}
	async get_chat_threads(start=0, size=25){
		return (await this.request("get", `${this.api}/g/s/chat/thread?type=joined-me&start=${start}&size=${size}`, this.parse_headers(this.session)));
	}
};

module.exports={
	Client
};