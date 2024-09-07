import https from "https"
import { readFile } from "fs";
import dotenv from "dotenv";

import { postRequest } from "./http.service";

dotenv.config();

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

export function DropboxGetListFolder() {
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

export function DropboxGetSharedLinks() {
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

export function DropboxUpload() {
    const auth = DropboxGetAuthToken();

    readFile('upload/image1.png', (err, data) => {
        if(err) {
            console.log("Error when reading file", err);
        }
        else {
            const dropboxAPIArgs = {
                'path': '/app/image2.png'
            }
        
            const options: https.RequestOptions = {
                hostname: 'content.dropboxapi.com',
                path: '/2/files/upload',
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Content-Type': 'application/octet-stream',
                    'Dropbox-API-Arg': JSON.stringify(dropboxAPIArgs)
                }
            }
            const body = data;
        
            const request = postRequest(options, body);
        
            request.then(response => {
                const res = response as Buffer;
        
                const json = JSON.parse(res.toString("utf-8"));
        
                console.log("promise response", json);
            })
            .catch(err => {
                try {
                    const error = JSON.parse(err);

                    console.log(error);
                }
                catch (error) {
                    console.log("couldn't parse error as JSON");
                    console.log(err);
                }
            })
        }
    })
}