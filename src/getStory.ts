import axios from 'axios';
import fs from 'fs';

const getStory = async (url: string, path: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        }).then((res: any) => {
            console.log("Downloaded!")
            res.data.pipe(fs.createWriteStream(path))
                .on('finish', () => { console.log("Finished saving."); resolve(res) })
                .on('error', (e: any) => { console.log("Error while downloading!"); reject(e) })
        }).catch((err: any) => { console.log("getStroy err", err) })
    })
}

export default getStory