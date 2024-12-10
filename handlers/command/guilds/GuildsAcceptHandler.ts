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
                        //console.log(error)
                        if (error.response?.status === 404) {
                            embed.setDescription(`Please check that the server ID is correct, that user \`nebura70\` is a member of ${guildData.clan.name}, and has application permissions.`);
                            return false;
                        }
                        return true;
                    }
                );

                if (!interaction.replied) {
                    const joinReqs = response.data["guild_join_requests"]
                    if (joinReqs) {
                        const joinRequestID = joinReqs[0]["join_request_id"]
                        const guildID = joinReqs[0]["guild_id"]
                        await this.tryAccept(joinRequestID, guildID, interaction)
                    } else {
                        let embed: EmbedBuilder = new EmbedBuilder().setColor(0xED4245);
                        embed.setDescription("**Could not parse guild application requests.** <@1118834539452706867>, wake up!")
                        interaction.reply({ embeds: [embed] })
                    }
                }
        }
    }

    async tryAccept(joinReqID: string, guildID: string, interaction: ChatInputCommandInteraction) {
        return await ApiUtil.wrapAxiosWithEmbedError(
            interaction, async () => {
                return await axios.patch(
                    `https://discord.com/api/v9/guilds/${guildID}/requests/id/${joinReqID}`,
                    {
                        "action" : "APPROVED"
                    },
                    {
                        headers: {
                            Authorization: SaturnBot.UB_TOKEN,
                        },
                        
                    }
                )
            }
        );
    }

    async canHandle(interaction: Interaction) {
        return false;//super.canHandle(interaction) && !interaction.isAutocomplete();
    }
}
