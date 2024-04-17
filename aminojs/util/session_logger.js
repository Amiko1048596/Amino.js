const fs=require('node:fs');
const helpers=require('./helpers');

class Stored{
	constructor(){
		this.fileName="aminoapps.json";
		this.sessions={};
	}
	is_stored_session_valid(email){
		if (this.sessions){
			let keys=Object.keys(this.sessions);
			if (keys.includes(email)){
				let session={};
				session[email]=this.sessions[email];
				return this.is_session_valid(session);
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	is_session_valid(session){
		if ((new Date(session[Object.keys(session)[0]]["timestamp"])).getTime()+86400000>Date.now()) return true;
		else return false;
	}
	create_session(email, sid, deviceId, auid){
		let session={};
		session[email]={
				"sid": sid,
				"deviceId": deviceId,
				"auid": auid,
				"timestamp": (new Date()).toISOString().split('.')[0]+"Z",
		};
		return session;
	}
	add_session(session){
		this.sessions[session[Object.keys(session)[0]]]={
			"sid": session[Object.keys(session)[0]]["sid"],
			"deviceId": session[Object.keys(session)[0]]["deviceId"],
			"auid": session[Object.keys(session)[0]]["auid"],
			"timestamp": session["timestamp"]??(new Date()).toISOString().split('.')[0]+"Z",
		};
	}
	update_sessions(sessions, reversed=false){
		if (reversed){
			for (let key of Object.keys(this.sessions))
				sessions[key]=this.sessions[key];
			this.sessions=sessions;
		} else {
			for (let key of Object.keys(sessions))
				this.sessions[key]=sessions[key];
		}
	}
	load_sessions(){
		if (fs.existsSync(this.fileName))
			try{
				this.sessions=JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
			} catch {
				this.sessions={};
			}
	}
	write_sessions(){
		if (fs.existsSync(this.fileName))
			try{
				let sessions=JSON.parse(fs.readFileSync(this.fileName));
				this.update_sessions(sessions, true);
				fs.writeFileSync(this.fileName, JSON.stringify(this.sessions, null, "    "));
			} catch {
				let sessions={};
				this.update_sessions(sessions, true);
				fs.writeFileSync(this.fileName, JSON.stringify(this.sessions, null, "    "));
			}
		else{
			let sessions=this.sessions;
			fs.writeFileSync(this.fileName, JSON.stringify(this.sessions, null, "    "));
		}
	}
	get_valid_sessions(){
		let sessions=JSON.parse(JSON.stringify(this.sessions));
		let keys=Object.keys(sessions);
		let i=0;
		while (true){
			if (i>=keys.length) break;
			if (!this.is_session_valid(sessions[keys[i]])){
				delete sessions[keys[i]];
				keys.splice(i, 1);
				continue;
			}
			i++;
		}
		return sessions;
	}
	list_sessions(){
		let sessions=this.get_valid_sessions();
		let keys=Object.keys(sessions);
		if (keys.length!=0){
			for(let i=0; i<keys.length; i++){
				console.log(`${i+1}.${keys[i]}`);
			}
		}
	}
	list_all_sessions(){
		let keys=Object.keys(this.sessions);
		if (keys.length!=0){
			for(let i=0; i<keys.length; i++){
				console.log(`${i+1}.${keys[i]}`);
			}
		}
	}
	choose_session(all=false){
		console.log("Choose a session:");
		let sessions;
		if (!all) {sessions=this.get_valid_sessions()}
		else {sessions=this.sessions}
		let keys=Object.keys(sessions);
		if (!all) {this.list_sessions()}
		else {this.list_all_sessions()}
		let key=keys[Number(helpers.input(">"))-1];
		let session={};
		session[key]=sessions[key];
		return session;
	}
};

module.exports={
	Stored
};