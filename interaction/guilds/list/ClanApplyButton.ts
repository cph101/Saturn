import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { SaturnButton } from "../../Commands";
import { ClanApplyStorage, Clans } from "../Clans";

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

        const uuid = ClanApplyStorage.getUUID();
        ClanApplyStorage.cache(interaction, uuid)

        const clan = new StringSelectMenuBuilder()
            .setCustomId('applyToClan::' + uuid)
            .setPlaceholder('Choose a guild')
            .addOptions(
                Clans.getClanMemberCounts()
                    .filter(({ members }) => members < 200) // check not full
                    .map(({ clan, members }, index) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(clan.name)
                            .setDescription(`${members} / 200 members`)
                            .setValue(index.toString())
                    )
            );

        const actions: ActionRowBuilder<StringSelectMenuBuilder> = 
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(clan);

        interaction.reply({
            content: 'Which guild would you like to apply to?',
            components: [actions],
            ephemeral: true
        });

    }

}