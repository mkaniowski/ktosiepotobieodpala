const { EmbedBuilder } = require('discord.js');
import fs from 'fs';
import path from 'node:path';


const ktoEmbed = () => {
    let rawdata = fs.readFileSync(path.join(__dirname, '../src/data.json'));
    let data = JSON.parse(rawdata.toString());

    let rawchannels = fs.readFileSync(path.join(__dirname, '../src/channels.json'));
    let channels = JSON.parse(rawchannels.toString());

    let embeds = new Array

    for (let i = 0; i < 3; i++) {
        embeds.push(
            new EmbedBuilder()
                .setColor(0xece910)
                .setTitle(data.nicknames[i])
                .setURL(channels[data.nicknames[i]].url)
                .setThumbnail(channels[data.nicknames[i]].avatar)
                .addFields(
                    { name: '\u200B', value: data.times[i] },
                )
        )
    }

    return embeds
}


export default ktoEmbed