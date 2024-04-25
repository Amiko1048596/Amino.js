const Socket = require("./aminojs/ws_client").SocketHandler;
const WSS = require("./aminojs/ws_client").WSS;
const Callbacks = require("./aminojs/ws_client").Callbacks;
const Client = require("./aminojs/client").Client;
const SubClient = require("./aminojs/sub_client").SubClient;

module.exports = {
    Socket,
    WSS,
    Callbacks,
    Client,
    SubClient
};