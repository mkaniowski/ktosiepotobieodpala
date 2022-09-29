const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

import ktoEmbed from "../src/ktoEmbed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kto')
        .setDescription('No kto sie po tobie odpala?'),

    async execute(interaction: any) {

        await interaction.reply({ embeds: ktoEmbed() })
    },
};

export { };