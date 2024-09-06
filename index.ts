import https from "https"

function getRequest(url: string) {
    https.get(url, res => {
        const buffers: Array<Buffer> = [];

        res.on('data', chunk => {
            const buffer = Buffer.from(chunk);

            buffers.push(buffer);
        })

        res.on('end', () => {
            const finalBuffer = Buffer.concat(buffers);

            console.log(finalBuffer.toString("utf-8"));
        })
    })
}

function main() {
    getRequest("https://api.dropboxapi.com/2/file_requests/count");
}

main();