import Tesseract from 'tesseract.js';

const ocr = async () => {
    let nicks = new Array
    let times = new Array
    console.log("Recognizing nicknames...")
    for (let i = 0; i < 3; i++) {
        await Tesseract.recognize(
            `./src/img/nickname${i}.jpg`,
            'eng', // eng works better than pol
        ).then(({ data: { text } }) => {
            let temp = text.replace('\n', '')
            if (temp === 'MtODY') { // becuse of eng ocr can't read polish signs
                nicks.push('MŁODY')
            } else {
                nicks.push(text.replace('\n', ''))
            }
            console.log(text.replace('\n', ''))
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