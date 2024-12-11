import {
    SlashCommandSubcommandBuilder,
    ChatInputCommandInteraction,
    SlashCommandStringOption,
    SlashCommandIntegerOption,
    Interaction,
    EmbedBuilder,
    SlashCommandUserOption
} from "discord.js";

import { SubCommandHandler } from "../../../api/command/SubCommandHandler";
import { Clan, Clans } from "../../../data/Clans";
import axios from "axios";
import { SaturnBot } from "../../..";
import { ApiUtil } from "../../../data/ApiUtil";
import { ClanDetails } from "../../../api/clan/ClanDetails";

export class GuildsAcceptHandler extends SubCommandHandler {
    buildRepresentable(): SlashCommandSubcommandBuilder {

        if (Clans.lastUpdated <= Date.now() - 1000 * 60 * 90) {
            Clans.refreshCache(null);
        }

        return new SlashCommandSubcommandBuilder()
            .setName("accept")
            .setDescription("Accepts people into a specified guild")
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("guild")
                    .setDescription("Guild to accept people into")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addUserOption(
                new SlashCommandUserOption()
                    .setName("name")
                    .setDescription("User name to accept")
                    .setRequired(false)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("id")
                    .setDescription("User id to accept")
                    .setRequired(false)
            )
    }

    async handleCommand(interaction: ChatInputCommandInteraction) {

        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.options.getString("guild");
        const member: string = interaction.options?.getString("id")
            ?? interaction.options?.getUser("name")?.id;

        if (!member) {
            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`Please specify a user to accept`)

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const guildData = Object.fromEntries(
            Clans.getClanMemberCounts().map(({ clan }) => [clan.name, clan])
        )[guild];

        const perhaps = await this.fetchApplication(guildData, interaction, "", member);
        let embed: EmbedBuilder = new EmbedBuilder()
        if (perhaps) {
            await this.tryAccept(perhaps["id"], perhaps["guild_id"], interaction);

            const guildInfo: ClanDetails = await ClanDetails.get(guildData.id);
            await guildInfo.withIconImage(async (emoji) => {
                embed.setColor(0x3567a3);
                embed.setDescription(`<@${member}> (\`${member}\`) has been accepted into <:${emoji.name}:${emoji.id}>\`${guildData.name}\``)
            });
        } else {
            embed.setColor(0xED4245);
            embed.setDescription("**Accept command failed.** <@1118834539452706867>, wake up!")
        }
        interaction.editReply({ embeds: [embed] })
    }

    async fetchApplication(guildData: Clan, interaction: ChatInputCommandInteraction, before: string, userID: string) {    
            const response =  await ApiUtil.wrapAxiosWithEmbedError(
                interaction, async () => {
                    //console.log(guildData)
                    return await axios.get(
                        `https://discord.com/api/v9/guilds/${guildData.id}/requests?status=SUBMITTED${before != "" ? "&before=" + before : ""}`,
                        {
                            headers: {
                                Authorization: SaturnBot.UB_TOKEN,
                            }
                        }
                    )
                }, (embed, error) => {
                    //console.log(error)
                    if (error.response?.status === 404) {
                        embed.setDescription(`Please check that the server ID is correct, that user \`nebura70\` is a member of ${guildData.name}, and has application permissions.`);
                        return false;
                    }
                    return true;
                }
            );

        const joinReqs: Object[] = response.data["guild_join_requests"]
        const maybe = joinReqs.find(obj => obj["user"]["id"] == userID)
        //console.log(maybe)
        if (!maybe) {
            if (joinReqs.reverse()[0] && joinReqs.reverse()[0]["id"]) {
                return await this.fetchApplication(guildData, interaction, joinReqs.reverse()[0]["id"], userID)
            }
        }
        return maybe;
    }

    async tryAccept(joinReqID: string, guildID: string, interaction: ChatInputCommandInteraction) {
        return await ApiUtil.wrapAxiosWithEmbedError(
            interaction, async () => {
                return await axios.patch(
                    `https://discord.com/api/v9/guilds/${guildID}/requests/id/${joinReqID}`,
                    {
                        "action": "APPROVED"
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
