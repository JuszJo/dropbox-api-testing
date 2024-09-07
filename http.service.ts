import https from "https";

export function getRequest(url: string, options: https.RequestOptions = {}) {
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

export function postRequest(options: https.RequestOptions, data: any) {
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
                    console.log(`Request failed with status code: ${statusCode}`);
                    
                    reject(finalBuffer.toString());
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