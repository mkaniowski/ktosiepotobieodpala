import * as dotenv from 'dotenv'
dotenv.config()
const { Client, Collection, GatewayIntentBits } = require('discord.js');
import fs from 'node:fs';
import path from 'node:path';
import cron from 'cron';
import getTimes from './src/getTimes';
import ktoEmbed from './src/ktoEmbed';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

let scheduledStory = new cron.CronJob('00 01 17-19 * * *', async () => {
    await getTimes()
});

let scheduledMessage = new cron.CronJob('00 02 18 * * *', async () => {
    let e = ktoEmbed()
    const channel = client.channels.cache.find((channel: any) => channel.name === 'general')
    channel.send({ embeds: e })
});

scheduledStory.start()
scheduledMessage.start()

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('rateLimit', (rate: any) => {
    console.log('Reached rate limit!', rate)
})

client.login(process.env.DC_TOKEN);