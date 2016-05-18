#!/usr/bin/env node
import * as path from "path";
import {ServerApp} from "./ServerApp";

export interface IStaticServerSetting {
    dir:string;
    port:number;
    env:string;
}

var setting:IStaticServerSetting = {
    dir: path.join(__dirname, '../html'),
    port: process.env.PORT,
    env: process.env.NODE_ENV
};

var server = new ServerApp(setting);
server.init();
server.start();
