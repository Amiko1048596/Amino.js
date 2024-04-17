const helpers=require("./util/helpers.js");
const headers=require("./util/headers.js");
const Client=require("./client.js").Client;
import('node-fetch');

class SubClient extends Client{
	constructor(client=null, comId="0"){
		if (client){
			this.stored=client.stored;
			this.api=client.api;
			this.session=client.session;
		}
		if (comId) this.comId=comId;
	}

};