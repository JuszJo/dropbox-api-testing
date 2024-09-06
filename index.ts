import https from "https";
import dotenv from "dotenv";

dotenv.config();

function getRequest(url: string, options: https.RequestOptions = {}) {
    const promise = new Promise((resolve, reject) => {
        https.get(url, options, res => {
            console.log(res.statusCode);
            
            const buffers: Array<Buffer> = [];
    
            res.on('data', chunk => {
                const buffer = Buffer.from(chunk);

                console.log(buffer);
                
    
                buffers.push(buffer);
            })
    
            res.on('end', () => {
                const finalBuffer = Buffer.concat(buffers);

                const response = finalBuffer.toString();
    
                // console.log(response);

                resolve(response)
            })
            
            res.on('error', err => {
                console.log("Error????", err);
                
                reject(err);
            })
        })
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

function DropboxGetListFolder() {
    const auth = DropboxGetAuth();

    const options: https.RequestOptions = {
        headers: {
            'Authorization': `Basic ${auth}`
        }
    }

    const request = getRequest("https://api.dropboxapi.com/2/files/list_folder", options);

    request.then(response => console.log(response));
}

function main() {
    DropboxGetListFolder();
}

main();