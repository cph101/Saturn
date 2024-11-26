import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SaturnSubCommand } from "../Commands";
import axios from "axios";

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { SaturnBot } from "../..";


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
            clanList += `\`${i + 1}\` <:guild${i + 1}icon:${CLANS[i].icon}> **\`#${CLANS[i].name.toUpperCase()}\`** (\`${await this.getClanMemberCount(CLANS[i].id) || 0} / 200\`)\n`
        }

        const embed = new EmbedBuilder()
            .setColor(0x1e1f22)
            .setTitle("Solarplanet guilds <:solarplanet1:1311064940404146206><:solarplanet1:1311065266201038899>")
            .setDescription(clanList)

        interaction.reply({ embeds: [embed] })
    }

    async getClanMemberCount(guildId: string) {

        if (guildId == null) return null;

        const response = await axios.get(
            `https://discord.com/api/v9/discovery/${guildId}/clan`, {
                headers: {
                    Authorization: SaturnBot.UB_TOKEN,
                }
            }
        );

        return response.data["member_count"];
    }
}