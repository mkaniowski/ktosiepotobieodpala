import * as dotenv from 'dotenv'
dotenv.config()
import { igApi, getCookie } from "insta-fetcher";
import fs from 'fs';
import getStory from './getStory';
import ocr from './ocr';
import crop from './crop';

const { IG_USERNAME: username = '', IG_PASSWORD: password = '' } = process.env;


const getTimes = async () => {
    let rawdata = fs.readFileSync('./src/data.json');
    let data = JSON.parse(rawdata.toString());

    if (new Date().getTime() - Date.parse(data.lastDate) >= 1000 * 60 * 15) {
        console.log("Getting sessionID...")
        const session_id = await getCookie(username, password)
            .then((res: any) => { return res })
            .catch((err: any) => { console.log(err.code, err.response.status, err.response.data.message) })

        if (session_id === undefined) return
        let ig = new igApi(session_id.toString());

        console.log("Downloading...")
        await ig.fetchStories("ktosiepotobieodpala").then(async (res: any) => {
            await getStory(res.stories[0].url, './src/img/latest.jpg')
            await crop()
        });

        let { nicks: nicknames = [], times: times = [] } = await ocr()

        fs.writeFileSync('./src/data.json',
            JSON.stringify(
                {
                    nicknames: nicknames,
                    times: times,
                    lastDate: new Date()
                }
            ));
        console.log("Done")
    } else {
        console.log(`On cooldown ${Math.ceil(15 - (new Date().getTime() - Date.parse(data.lastDate)) / (1000 * 60))} minute(s)`)
    }
}

export default getTimes