#!/usr/bin/env node
import * as path from "path";
import {ServerApp} from "./ServerApp";

export interface IStaticServerSetting {
    dir:{
        html:string;
        upload:string;
    };
    port:number;
    env:string;
}

var setting:IStaticServerSetting = {
    dir: {
        html: path.join(__dirname, '../html'),
        upload: '/upload'
    },
    port: process.env.PORT,
    env: process.env.NODE_ENV
};

var server = new ServerApp(setting);
server.init();
server.start();
