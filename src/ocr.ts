import Tesseract from 'tesseract.js';

const ocr = async () => {
    let nicks = new Array
    let times = new Array
    console.log("Recognizing nicknames...")
    for (let i = 0; i < 3; i++) {
        await Tesseract.recognize(
            `./src/img/nickname${i}.jpg`,
            'pol',
        ).then(({ data: { text } }) => {
            nicks.push(text.replace('\n', ''))
        })
    }
    console.log(`Recognized ${nicks.length} nicknames`)

    console.log("Recognizing times...")
    for (let i = 0; i < 3; i++) {
        await Tesseract.recognize(
            `./src/img/time${i}.jpg`,
            'eng',
        ).then(({ data: { text } }) => {
            times.push(text.replace('\n', ''))
        })
    }
    console.log(`Recognized ${times.length} times`)

    return { nicks, times }
}

export default ocr