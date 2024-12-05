import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { ClanApplyStorage, Clans } from "../../../data/Clans";


export class ClanCommandList {
    makeSubCommand(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("list").setDescription("Lists Solarplanet Guilds")
    }

    async handle(interaction: ChatInputCommandInteraction) {

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

        clanList += "\n <:info:1312840063276548207> **Note: Only level 30 members or server boosters may join guilds.**"

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0x3567a3)
            .setTitle("Solarplanet guilds <:solarplanet1:1311064940404146206>"
                + "<:solarplanet1:1311065266201038899>")
            .setDescription(clanList)

        const apply: ButtonBuilder | null = null// = SaturnCommands
            //.getBtn("clanCandidateApplyButton").makeButton();

        const actions: ActionRowBuilder<ButtonBuilder> = 
            new ActionRowBuilder<ButtonBuilder>()
			    .addComponents(apply);

        const msg = await interaction.reply({ embeds: [embed], components: [actions] })

    }
}