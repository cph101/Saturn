import { 
    SlashCommandSubcommandBuilder, ChatInputCommandInteraction, 
    EmbedBuilder, ButtonBuilder, ActionRowBuilder 
} from "discord.js";

import { SubCommandHandler } from "../../../api/command/SubCommandHandler";
import { Clans } from "../../../data/Clans";
import { ApplyButtonHandler } from "../../button/ApplyButtonHandler";

export class GuildsListHandler extends SubCommandHandler {

    buildRepresentable(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
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
            }\`** (\`${members} / 200\`)\n`;
        });

        clanList += "\n <:info:1312840063276548207> **Note: Only level 20 members or server boosters may join guilds.**"

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0x3567a3)
            .setTitle("Solarplanet guilds <:solarplanet1:1311064940404146206>"
                + "<:solarplanet1:1311065266201038899>")
            .setDescription(clanList)

        const apply: ButtonBuilder = ApplyButtonHandler.buildRepresentable()

        const actions: ActionRowBuilder<ButtonBuilder> = 
            new ActionRowBuilder<ButtonBuilder>()
			    .addComponents(apply);

        interaction.reply({ embeds: [embed] })
    }
    
}