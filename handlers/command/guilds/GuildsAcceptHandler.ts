import {
    SlashCommandSubcommandBuilder,
    ChatInputCommandInteraction,
    SlashCommandStringOption,
    SlashCommandIntegerOption,
    Interaction,
    EmbedBuilder
} from "discord.js";

import { SubCommandHandler } from "../../../api/command/SubCommandHandler";
import { Clans } from "../../../data/Clans";
import axios from "axios";
import { SaturnBot } from "../../..";
import { ApiUtil } from "../../../data/ApiUtil";

export class GuildsAcceptHandler extends SubCommandHandler {
    buildRepresentable(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("accept")
            .setDescription("Accepts people into a specified guild")
            .addStringOption(
                new SlashCommandStringOption()
                    .setAutocomplete(true)
                    .setName("guilds")
                    .setDescription("Guilds to accept people into")
                    .setRequired(true)
            )
            .addIntegerOption(
                new SlashCommandIntegerOption()
                    .setMaxValue(200)
                    .setName("number")
                    .setDescription("Maximum number of people to accept")
                    .setRequired(true)
            );
    }

    async handleCommand(interaction: ChatInputCommandInteraction) {
        // Refresh cache if needed
        if (Clans.lastUpdated <= Date.now() - 1000 * 60 * 90) {
            await Clans.refreshCache(null);
        }

        // Parse and validate guilds
        const guilds = interaction.options.getString("guilds").split(",").map((guild) => guild.trim());

        const guildsExisting = Clans.getClanMemberCounts()
            .filter(g => g.members <= 200)

        for (const guild of guilds) {
            if (!guildsExisting[guild]) {
                const embed = new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle(`Error: Guild "${guild}" does not exist.`)
                    .setDescription("Please use Autocomplete to ensure correct guild names.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }

        for (const guild of guilds) {
            const guildData = guildsExisting[guild];
            const maxAccept = interaction.options.getInteger("number");
            const guildCanTake = Math.min(maxAccept, 200 - guildData.members);

                const response = await ApiUtil.wrapAxiosWithEmbedError(
                    interaction, async () => {
                        //console.log(guildData)
                        return await axios.get(
                            `https://discord.com/api/v9/guilds/${guildData.clan.id}/requests?status=SUBMITTED&limit=${guildCanTake}`,
                            {
                                headers: {
                                    Authorization: SaturnBot.UB_TOKEN,
                                }
                            }
                        )
                    }, (embed, error) => {
                        embed.setDescription("Error: User `nebura70` requires guild application permissions in the affected server(s).")
                        return false;
                    }
                );
        }
    }

    async canHandle(interaction: Interaction) {
        return false;//super.canHandle(interaction) && !interaction.isAutocomplete();
    }
}
