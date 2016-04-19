import * as express from "express";
import * as morgan from "morgan";
import * as http from "http";
import {IStaticServerSetting} from "./staticApp";

export class StaticServer {
    private app:express.Express;
    private server:http.Server;

    constructor(private setting:IStaticServerSetting) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.server.on('error', err=>console.error('Static server error: ', err));
        this.server.on('listening', arg=>console.log('Static server starts listening on ', this.server.address()));
    }

    private configExpressServer() {
        this.app.use(morgan(this.setting.env == 'development' ? 'dev' : 'combined'));
        this.app.enable('trust proxy');
        this.app.disable('case sensitive routing');
        this.app.disable('strict routing');
        this.app.disable('x-powered-by');
    }

    public init() {
        this.configExpressServer();
        this.app.use(express.static(this.setting.dir));
        this.app.use((req, res, next) => {
            res.status(404);
            if (/.+\.(html|htm|js|css|xml|png|jpg|jpeg|gif|pdf|txt|ico|woff|woff2|svg|eot|ttf|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent)$/i.exec(req.url)) {
                return res.end();
            }
            console.log('\n\nNot Found: ' + req.url + '\n\n');
            res.sendFile('/app/build/index.html');
        });

        if (this.setting.env === 'development') {
            this.app.use((err:any, req, res, next) => {
                res.status(err.status || 500);
                console.log('development error', err);
                res.json({message: err.message, error: err});
            });
        }

        this.app.use((err:any, req, res, next) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }

    public start() {
        this.server.listen(this.setting.port);
    }
}
