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
            // console.log(res.stories[0].url)
            await getStory(res.stories[0].url, './src/img/latest.jpg')
            console.log("Downloaded!")
            await crop()
        });
        // console.log("Downloading...")
        // await getStory('https://instagram.fktw4-1.fna.fbcdn.net/v/t51.2885-15/308524352_774200476994515_8723058998768109935_n.jpg?stp=dst-jpg_e35_p750x750_sh0.08&_nc_ht=instagram.fktw4-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=R_9i8GASiAAAX_zvAyg&edm=AOVtZ6oBAAAA&ccb=7-5&ig_cache_key=MjkzNTY2NTE4MzY3ODQ4Nzk3Ng%3D%3D.2-ccb7-5&oh=00_AT_7tMoKQ1tRwgcdfvrWaCpAQ-GbZRDbpMhiXsP6moymyA&oe=63343CA5&_nc_sid=bab638', './src/img/latest.jpg')
        // await crop()
        // console.log("Downloaded!")


        let { nicks: nicknames = [], times: times = [] } = await ocr()

        fs.writeFileSync('./src/data.json',
            JSON.stringify(
                {
                    nicknames: nicknames,
                    times: times,
                    lastDate: new Date()
                }
            ));
    } else {
        console.log(`On cooldown ${Math.ceil(15 - (new Date().getTime() - Date.parse(data.lastDate)) / (1000 * 60))} minute(s)`)
    }
}

getTimes()