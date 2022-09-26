import sharp from 'sharp';

const crop = async () => {
    console.log("Cropping nicknames...")
    for (let i = 0; i < 3; i++) {
        const width = 350
        const height = 45
        const x = 200
        const y = 265
        return new Promise((resolve, reject) => {
            sharp('./src/img/latest.jpg')
                .extract({ left: x, top: y + i * 180, width: width, height: height })
                .toFile(`./src/img/nickname${i}.jpg`, (err: any, info: any) => {
                    if (err) {
                        console.log('Error while cropping nickname no.', i, '\n', err);
                        reject(err)
                    }
                    if (info) {
                        console.log(`Nicknames no. ${i} cropped`)
                        resolve(info)
                    }
                })
        })
    }

    console.log("Cropping times...")
    for (let j = 0; j < 3; j++) {
        const width = 130
        const height = 60
        const x = 570
        const y = 280
        return new Promise((resolve, reject) => {
            sharp('./src/img/latest.jpg')
                .extract({ left: x, top: y + j * 180, width: width, height: height })
                .toFile(`./src/img/time${j}.jpg`, (err: any, info: any) => {
                    if (err) {
                        console.log('Error while cropping time no.', j, '\n', err);
                        reject(err)
                    }
                    if (info) {
                        console.log(`Times no. ${j} cropped`)
                        resolve(info)
                    }
                })
        })
    }
}

export default crop