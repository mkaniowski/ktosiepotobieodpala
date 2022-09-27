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
            await crop()
        });
        // console.log("Downloading...")
        // await getStory('https://instagram.fktw4-1.fna.fbcdn.net/v/t51.2885-15/309052831_103966642443612_644804160036509552_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08&_nc_ht=instagram.fktw4-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=BF17sRqh55IAX_N2KPI&tn=NKhQVcrW6OkPi9Dq&edm=ANmP7GQBAAAA&ccb=7-5&ig_cache_key=MjkzNjA4MDI3NTM1NjIzMjExNQ%3D%3D.2-ccb7-5&oh=00_AT8AVRo9sbgUOuXJCtgtWIep7fuu87uqbeJwid4PaIFyAg&oe=63352043&_nc_sid=276363', './src/img/latest.jpg')
        // console.log("Downloaded!")
        // await crop()


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