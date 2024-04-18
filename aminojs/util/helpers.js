const crypto = require('node:crypto');
const fs = require('node:fs');

const PREFIX = new Uint8Array(Buffer.from("19", 'hex'));
const SIG_KEY = new Uint8Array(Buffer.from("DFA5ED192DDA6E88A12FE12130DC6206B1251E44", 'hex'));
const DEVICE_KEY = new Uint8Array(Buffer.from("E7309ECC0953C6FA60005B2765F99DBBC965C8E9", 'hex'));

function uuid4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}

function gen_deviceId(data = null) {
    if (data && Object.getPrototypeOf(data).constructor.name === "String") data = Buffer.from(data, 'hex');
    let identifier = Buffer.concat([PREFIX, data ?? crypto.randomBytes(20)]);
    let mac = crypto.createHmac('sha1', DEVICE_KEY).update(identifier);
    return `${Buffer.from(identifier).toString('hex')}${mac.digest('hex')}`.toUpperCase();
}

function signature(data) {
    data = Object.getPrototypeOf(data).constructor.name === "String" ? (new TextEncoder()).encode(data) : data;
    data = Buffer.concat([PREFIX, new Uint8Array(crypto.createHmac("sha1", SIG_KEY).update(data).digest())])
    return btoa(String.fromCharCode(...new Uint8Array(data)));
}

function update_deviceId(device) {
    return gen_deviceId(new Uint8Array(Buffer.from(`${device}`.slice(2, 42), 'hex')));
}

function decode_sid(sid) {
    return JSON.parse(atob(String.fromCharCode(...new Uint8Array((new TextEncoder()).encode((sid + "=".repeat((sid.length + 1) % 4)).replaceAll("-", "+").replaceAll("-", "/"), "utf-8")))).slice(1, -20));
}

function sid_to_uid(SID) {
    return decode_sid(SID)["2"];
}

function sid_to_ip_address(SID) {
    return decode_sid(SID)["4"];
}

module.exports = {
    uuid4,
    PREFIX,
    SIG_KEY,
    DEVICE_KEY,
    uuid4,
    gen_deviceId,
    signature,
    update_deviceId,
    decode_sid,
    sid_to_uid,
    sid_to_ip_address
};