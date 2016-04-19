#!/usr/bin/env node
import {StaticServer} from "./StaticServer";

export interface IStaticServerSetting {
    dir:string;
    port:number;
    env:string;
}

var setting:IStaticServerSetting = {
    dir: '/app/build',
    port:process.env.PORT,
    env: process.env.NODE_ENV
};

var server = new StaticServer(setting);
server.init();
server.start();
