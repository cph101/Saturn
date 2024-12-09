import { 
    Interaction, StringSelectMenuInteraction, 
    ActionRowBuilder, ButtonBuilder, ButtonStyle 
} from "discord.js";

import { EventHandler } from "../../api/EventHandler";
import { ClanApplyStorage, Clans } from "../../data/Clans";

export class ApplyFormHandler extends EventHandler<"interactionCreate"> {

    async handle(interaction: StringSelectMenuInteraction) {
        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(interaction); 
        }

        const selectedClan = Clans.getClanMemberCounts()[Number.parseInt(interaction.values[0])]
        const invite = "https://discord.gg/" + selectedClan.clan.invite;

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setURL(invite).setStyle(ButtonStyle.Link).setLabel("Join server")
        )

        const oldInteraction = ClanApplyStorage.query(interaction.customId?.split("::")[1]);

        const content = `**${selectedClan.clan.name}** selected. Click below to join:`

        oldInteraction.editReply({ content, components: [actionRow] })

        interaction.deferUpdate()
    }

    handledEvent(): "interactionCreate" {
        return "interactionCreate";
    }

    async canHandle(interaction: Interaction) {
        if (interaction.isStringSelectMenu()) {
            return interaction.customId.split("::")[0] == "applyToClanForm";
        } else return false;
    }
    
}