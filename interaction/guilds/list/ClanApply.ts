import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from "discord.js";
import { ClanApplyStorage, Clans } from "../Clans";

export class ClanApply {

    public static async applyToClan(interaction: StringSelectMenuInteraction) {
        const selectedClan = Clans.getClanMemberCounts()[Number.parseInt(interaction.values[0])]
        const invite = "https://discord.gg/" + selectedClan.clan.invite;

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setURL(invite).setStyle(ButtonStyle.Link).setLabel("Join server")
        )

        const iMeta = ClanApplyStorage.query(interaction.customId.split("::")[1])

        await interaction.editReply({
            content: `You selected ${selectedClan.clan.name}! Click below to join:`,
            components: [actionRow]
        });
    }

}