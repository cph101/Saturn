import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SaturnSubCommand } from "../Commands";

import * as fs from "node:fs/promises";
import * as path from "node:path";

export class ClanCommandList implements SaturnSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("list").setDescription("Lists Solarplanet Guilds")
    }

    async handle(interaction: ChatInputCommandInteraction) {

        let CLANS = JSON.parse(await fs.readFile(
            path.resolve('resources/SolarPlanetGuilds.json'), 
            { encoding: 'utf8' }
        )).values;

        var clanList = "";
        
        for (var i = 0; i < CLANS.length; i++) {
            clanList += `\`${i}\` <:${CLANS[i].name.toLowerCase()}guild:${CLANS[i].icon}> **\`#${CLANS[i].name.toUpperCase()}\`** (\`${CLANS[i].id || 0}\`)\n`
        }

        const embed = new EmbedBuilder()
            .setColor(0x1e1f22)
            .setTitle("Solarplanet guilds <:solarplanet1:1311064940404146206><:solarplanet1:1311065266201038899>")
            .setDescription(clanList)

        interaction.reply({ embeds: [embed] })
    }
}