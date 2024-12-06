import { 
    Interaction, ButtonInteraction, ButtonBuilder, ButtonStyle, 
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder 
} from "discord.js";

import { EventHandler } from "../../api/EventHandler";
import { ClanApplyStorage, Clans } from "../../data/Clans";

export class ApplyButtonHandler extends EventHandler<"interactionCreate"> {

    private static whitelistedRoles = [
        "1306645845642444810", // top floor
        "1304539496301465681", // loved
        "1248920049457303655" // rich
    ]

    public static buildRepresentable(): ButtonBuilder {
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


        // TODO: find out why this is happening, might be perms
        // Add a perms parameter to EventSubscriber (see big A refactor)
        const user = await interaction.guild.members.fetch(interaction.user)
        console.log(user.roles.cache.hasAny(...ApplyButtonHandler.whitelistedRoles))
        
        interaction.reply({
            content: 'Which guild would you like to apply to?',
            components: [actions],
            ephemeral: true
        });

    }

    async canHandle(interaction: Interaction) {
        if (interaction.isButton() && interaction instanceof ButtonInteraction) {
            return interaction.customId == "clanCandidateApplyButton";
        } else return false;
    }
}