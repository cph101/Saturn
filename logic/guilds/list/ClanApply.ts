import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, TextBasedChannel } from "discord.js";
import { ClanApplyStorage, Clans } from "../../../data/Clans";

export class ClanApply {

    public static async applyToClan(interaction: StringSelectMenuInteraction) {
        const selectedClan = Clans.getClanMemberCounts()[Number.parseInt(interaction.values[0])]
        const invite = "https://discord.gg/" + selectedClan.clan.invite;

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setURL(invite).setStyle(ButtonStyle.Link).setLabel("Join server")
        )

        const oldInteraction = ClanApplyStorage.query(interaction.customId?.split("::")[1]);

        let humanReadableName = selectedClan.clan.name;

        if (selectedClan.clan.id == "966137238880682145") {
            // long ass symbols guild
            humanReadableName = `Long, aka ${humanReadableName.slice(0, 1)}...`;
        }

        const content = `**${humanReadableName}** selected. Click below to join:`

        oldInteraction.editReply({ content, components: [actionRow] })
        interaction.deferUpdate()
    }

}