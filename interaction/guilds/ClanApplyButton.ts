import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { SaturnButton } from "../Commands";
import { Clans } from "./Clans";

export class ClanApplyButton implements SaturnButton {

    makeButton(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId("clanCandidateApplyButton")
            .setLabel("Apply")
            .setStyle(ButtonStyle.Primary);
    }

    async handle(interaction: ButtonInteraction) {

        // Return new response if last checked 1 1/2 hours ago or more
        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(interaction); 
        }

        const clan = new StringSelectMenuBuilder()
            .setCustomId('clan')
            .setPlaceholder('Choose a guild')
            .addOptions(
                Clans.getClanMemberCounts()
                    .filter(({ members }) => members < 200) // check not full
                    .map(({ clan, members }) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(clan.name)
                            .setDescription(`${members} / 200 members`)
                            .setValue(clan.name.toLowerCase())
                    )
            );

        const actions: ActionRowBuilder<StringSelectMenuBuilder> = 
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(clan);

        await interaction.reply({
            content: 'Choose a guild',
            components: [actions],
            ephemeral: true
        });
    }

}