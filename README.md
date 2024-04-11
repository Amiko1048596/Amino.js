How to use?

Example:

const Client=require("./client").Client;

const main=async function(){
client=new Client();
console.log(await client.login("email", "pass"));
console.log(await client.get_chat_threads());
}
main();
