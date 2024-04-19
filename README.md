# AminoApps.js

### Example:
```js
const Client=require("./aminojs/client").Client;

const main=async function(){
  client=new Client();
  console.log(await client.login("email", "pass"));
  console.log(await client.get_chat_threads());
}
main();
```
### Another example:
```js
const Client=require("./aminojs/client").Client;
const SubClient=require("./aminojs/sub_client").SubClient;
const input=require('prompt-sync')();

async function choose_from_sub_clients(client, debug=false){
  let subClients=(await client.sub_clients())["communityList"];
  for(let i=0;i<subClients.length;i++)
    console.log(`${i+1}.${subClients[i]["name"]}`);
  let ch=Number(input(">"))-1;
  if (debug) console.log(`${subClients[ch]["name"]}=${subClients[ch]["ndcId"]}`);
  return subClients[ch]["ndcId"];
}

async function choose_from_chat_threads(client, debug=false){
  let threads=(await client.get_chat_threads())["threadList"];
  for(let i=0;i<threads.length;i++)
    console.log(`${i+1}.${threads[i]["title"]}`);
  let ch=Number(input(">"))-1;
  if (debug) console.log(`${threads[ch]["title"]}=${threads[ch]["threadId"]}`);
  return threads[ch]["threadId"];
}

const main=async function(){
  client=new Client();
  await client.login("email", "pass")
  let ndcId=await choose_from_sub_clients(client);
  console.log(ndcId);
  subClient=new SubClient(client=client, ndcId=ndcId);
  let threadId=await choose_from_chat_threads(subClient);
  await subClient.send_message(threadId, "test");
}
main();

```
### Creating a bot:
```js
const Socket=require("./aminojs/ws_client").SocketHandler;
const Callbacks=require("./aminojs/ws_client").Callbacks;
const Client=require("./aminojs/client").Client;


const main=async function(){
  client=new Client();
  await client.login("email", "pass")
  websocket=new Socket(client);
  class Bot extends Callbacks{
    constructor(){super();}
    on_text_message(data){
      console.log(data);
    }
  }
  websocket.start(new Bot());
}
main();
```
