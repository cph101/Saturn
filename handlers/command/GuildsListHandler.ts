import { 
    ChatInputCommandInteraction, 
    EmbedBuilder, SlashCommandBuilder
} from "discord.js";

import { Clans } from "../../data/Clans";
import { CommandLikeHandler } from "../../api/command/CommandLikeHandler";

export class GuildsListHandler extends CommandLikeHandler {

    buildRepresentable(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("list").setDescription("Lists Solarplanet Guilds")
    }

    async handleCommand(interaction: ChatInputCommandInteraction) {

        var clanList: string = "";

        // Return new response if last checked 1 1/2 hours ago or more
        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(interaction); 
        }
        
        Clans.getClanMemberCounts().forEach(async ({ clan, members }, index) => {
            if (interaction.replied) return;

            clanList += `\`${index + 1}\` <:guild${index + 1}icon:${clan.icon}> **\`#${
                clan.name.toUpperCase()
            }\`** (\`${clan.id}\`) - **${members} / 200**\n`;
        });

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0x3567a3)
            .setTitle("Solarplanet guilds <:solarplanet1:1311064940404146206>"
                + "<:solarplanet1:1311065266201038899>")
            .setDescription(clanList)
            .setFooter({
                iconURL: "https://cdn.discordapp.com/icons/1244682239187619940/1daabaf95feb6c2463ca8b7cfc951896.webp",
                text: "discord.gg/solarplanet"
            })

        interaction.reply({ embeds: [embed] })
    }
    
}