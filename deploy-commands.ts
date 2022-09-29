require('dotenv').config()
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const token = process.env.DC_TOKEN ?? ''
const clientID = process.env.DC_CLIENT_ID ?? ''

const commands = new Array
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: String) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: commands })
    .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);

export { };