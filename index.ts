import https from "https";
import { readFile } from "fs";
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

function postRequest(options: https.RequestOptions, data: any) {
    const promise = new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            const buffers: Array<Buffer> = [];
    
            res.on('data', chunk => {
                const buffer = Buffer.from(chunk);                
    
                buffers.push(buffer);
            })
    
            res.on('end', () => {
                const finalBuffer = Buffer.concat(buffers);
                const statusCode = res.statusCode || 500;

                if (statusCode < 200 || statusCode >= 300) {
                    reject(new Error(`Request failed with status code: ${statusCode}`));
                }

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

function DropboxGetSharedLinks() {
    const auth = DropboxGetAuthToken();
    // const auth = DropboxGetAuth();

    const options: https.RequestOptions = {
        hostname: 'api.dropboxapi.com',
        path: '/2/sharing/list_shared_links',
        method: "POST",
        headers: {
            'Authorization': `Bearer ${auth}`,
            'Content-Type': 'application/json'
        }
    }

    /* const data: GetListFolder = {
        path: "/app/images"
    } */
    const cursor1 = "AspgUpjtjpNgSE9f9kljbcL6RJMs9BnyKp_LAWusASMatItQa1jrNoOv7D0e6oosOB4cj9ylkD900_Y_YusS1XiL5k-3YwwanYax7jXt-QvDpg";
    // const cursor2 = "AsrwBfFu_KKtvhYt1Y_anEkHjyJHJltUu_xDIuqjNEZna6lCnhajxnk7gaHshnd7JbQ1I15aMHHS3Snjp5CV02UJfrcztlQcXZ6C1SAzH8oPtw";

    const data = {
        cursor: cursor1
    }

    const body = JSON.stringify(data);

    const request = postRequest(options, body);

    request.then(response => {
        const res = response as Buffer;

        // console.log("promise response", JSON.parse(res.toString("utf-8")));
        const json = JSON.parse(res.toString("utf-8"));

        console.log("promise response", json);
    })
    .catch(err => {
        console.log("promise error", err);
    })
}

function DropboxUpload() {
    const auth = DropboxGetAuthToken();

    const dropboxAPIArgs = {
        'path': '/app'
    }

    const options: https.RequestOptions = {
        hostname: 'api.dropboxapi.com',
        path: '/2/files/upload',
        method: "POST",
        headers: {
            'Authorization': `Bearer ${auth}`,
            'Content-Type': 'application/json',
            'Dropbox-API-Arg': JSON.stringify(dropboxAPIArgs)
        }
    }

    readFile('index.html', (err, data) => {
        if(err) {
            console.log("Error when reading file", err);
        }
        else {
            const body = data;
        
            const request = postRequest(options, body);
        
            request.then(response => {
                const res = response as Buffer;
        
                // console.log("promise response", JSON.parse(res.toString("utf-8")));
                const json = JSON.parse(res.toString("utf-8"));
        
                console.log("promise response", json);
            })
            .catch(err => {
                console.log("promise error", err);
            })
        }
    })
}

function main() {
    // DropboxGetListFolder();
    // DropboxGetSharedLinks();
    DropboxUpload();
}

main();