import https from "https";
import dotenv from "dotenv";

dotenv.config();

function getRequest(url: string, options: https.RequestOptions = {}) {
    const promise = new Promise((resolve, reject) => {
        https.get(url, options, res => {
            const buffers: Array<Buffer> = [];
    
            res.on('data', chunk => {
                const buffer = Buffer.from(chunk);                
    
                buffers.push(buffer);
            })
    
            res.on('end', () => {
                const finalBuffer = Buffer.concat(buffers);

                // const response = finalBuffer.toString();

                resolve(finalBuffer);
            })
            
            res.on('error', err => {
                console.log("Error????", err);
                
                reject(err);
            })
        })
    })

    return promise;
}

function postRequest(options: https.RequestOptions, data: string) {
    const promise = new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            const buffers: Array<Buffer> = [];
    
            res.on('data', chunk => {
                const buffer = Buffer.from(chunk);                
    
                buffers.push(buffer);
            })
    
            res.on('end', () => {
                const finalBuffer = Buffer.concat(buffers);
    
                // console.log("Client response", response);

                resolve(finalBuffer);
            })
        })

        req.on('error', err => {
            console.log("Error with request", err);

            reject(err);
        })
    
        req.write(data);

        req.end();
    })

    return promise;
}

function DropboxGetAuthToken() {
    const dropBoxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;

    return dropBoxAccessToken;
}

function DropboxGetAuth() {
    const dropBoxAppKey = process.env.DROPBOX_APP_KEY;
    const dropBoxAppSecret = process.env.DROPBOX_APP_SECRET;

    const auth = Buffer.from(`${dropBoxAppKey}:${dropBoxAppSecret}`).toString("base64");

    return auth;
}

type GetListFolder = {
    include_deleted?: boolean,
    include_has_explicit_shared_members?: boolean,
    include_media_info?: boolean,
    include_mounted_folders?: boolean,
    include_non_downloadable_files?: boolean,
    path: string,
    recursive?: boolean
}

function DropboxGetListFolder() {
    const auth = DropboxGetAuthToken();
    // const auth = DropboxGetAuth();

    const options: https.RequestOptions = {
        hostname: 'api.dropboxapi.com',
        path: '/2/files/list_folder',
        method: "POST",
        headers: {
            'Authorization': `Bearer ${auth}`,
            'Content-Type': 'application/json'
        }
    }

    const data: GetListFolder = {
        path: "/app"
    }

    const body = JSON.stringify(data);

    const request = postRequest(options, body);

    request.then(response => {
        const res = response as Buffer;

        console.log("promise response", JSON.parse(res.toString("utf-8")));
    });
}

function main() {
    DropboxGetListFolder();
}

main();