import {
    ChatInputCommandInteraction, SlashCommandStringOption,
    Interaction, EmbedBuilder, SlashCommandUserOption,
    SlashCommandBuilder, SlashCommandOptionsOnlyBuilder,
    EmbedAuthorOptions
} from "discord.js";

import axios from "axios";
import { CommandLikeHandler } from "../../api/command/CommandLikeHandler";
import { Clan, Clans } from "../../data/Clans";
import { ClanDetails } from "../../api/clan/ClanDetails";
import { SaturnBot } from "../..";

export class GuildsAcceptHandler extends CommandLikeHandler {
    buildRepresentable(): SlashCommandOptionsOnlyBuilder {

        return new SlashCommandBuilder()
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

        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(interaction);
        }

        const guildData = Clans.getClanMemberCounts().map(({ clan }) => clan)[guild];

        const author: EmbedAuthorOptions = {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL()
        }

        let embed: EmbedBuilder = new EmbedBuilder()
            .setFooter({
                iconURL: "https://cdn.discordapp.com/icons/1244682239187619940/1daabaf95feb6c2463ca8b7cfc951896.webp",
                text: "discord.gg/solarplanet"
            })
            .setColor(0x3567a3)
            .setAuthor(author);

        logic: {

            const perhaps = await this.fetchApplication(guildData, interaction, "", member);

            if (!guildData) {
                embed.setColor(0xED4245);
                embed.setDescription(`No such guild, \`${guild}\``);
                break logic;
            }

            if (perhaps) {
                await this.tryAccept(perhaps["id"], perhaps["guild_id"], interaction);

                const guildInfo: ClanDetails = await ClanDetails.get(guildData.id);

                if (guildData.name == "Hail") {
                    embed.setDescription(`<@${member}> (\`${member}\`) has been accepted into <:HAIL:1311067084926746735>\`${guildData.name}\``)
                } else await guildInfo.withIconImage(async (emoji) => {
                    embed.setDescription(`<@${member}> (\`${member}\`) has been accepted into <:${emoji.name}:${emoji.id}>\`${guildData.name}\``)
                });
            } else {
                embed.setColor(0xED4245);
                embed.setDescription(`No application was found for <@${member}> (\`${member}\`) in \`${guildData.name}\``);
            }
        }
        interaction.editReply({ embeds: [embed] })
    }

    async fetchApplication(guildData: Clan, interaction: ChatInputCommandInteraction, before: string, userID: string) {
        //console.log(guildData)
        const response =  /*await ApiUtil.wrapAxiosWithEmbedError(
                interaction, async () => {
                    //console.log(guildData)
                    return */await axios.get(
            `https://discord.com/api/v9/guilds/${guildData.id}/requests?status=SUBMITTED${before != "" ? "&before=" + before : ""}`,
            {
                headers: {
                    Authorization: SaturnBot.UB_TOKEN,
                }
            }
        )
        /*}, (embed, error) => {
            //console.log(error)
            if (error.response?.status === 404) {
                embed.setDescription(`Please check that the server ID is correct, that user \`nebura70\` is a member of ${guildData.name}, and has application permissions.`);
                return false;
            }
            return true;
        }
    );*/

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
}
