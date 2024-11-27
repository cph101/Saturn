import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption, SnowflakeUtil, User, UserManager } from "discord.js";
import { SaturnSubCommand } from "../Commands";
import { ApiUtil } from "../ApiUtil";

import axios from "axios";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { SaturnBot } from "../..";

export class ClanCommandUser implements SaturnSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("user").setDescription("Gets guild information about the specified user, or the command sender")
            .addUserOption(new SlashCommandUserOption().setName("name").setDescription("User name to get guild info about").setRequired(false))
            .addStringOption(new SlashCommandStringOption().setName("id").setDescription("User id to get guild info about").setRequired(false))
    }

    async handle(interaction: ChatInputCommandInteraction) {
        const id: string = interaction.options.getString("id") ?? (interaction.options.getUser("name") ?? interaction.user).id;

        const user: User = await this.getUser(id, interaction)

        if (!interaction.replied) {
            if (user["clan"]) {
                const emoji = await this.createEmoji(
                    user["clan"]["identity_guild_id"], user["clan"]["badge"]
                );

                let CLANS: string[] = JSON.parse(await fs.readFile(
                    path.resolve('resources/SolarPlanetGuilds.json'),
                    { encoding: 'utf8' }
                )).values.map(clan => clan["id"]);

                const isSPOwned = CLANS.includes(user["clan"]["identity_guild_id"]);

                const reply = new EmbedBuilder()
                    .setColor(0x3567a3)

                reply.setTitle(user.username + "'s clan")

                reply.setDescription(`<:${emoji.name}:${emoji.id}> **${user["clan"]["tag"]}** - ${isSPOwned ? "Owned" : "Not owned"} by Solarplanet`)

                await interaction.reply({ embeds: [reply] })

                SaturnBot.INSTANCE.client.application.emojis.delete(emoji.id)
            } else {
                const reply = new EmbedBuilder()
                    .setColor(0x3567a3)

                reply.setTitle(user.username + " does not belong to any clan")

                interaction.reply({ embeds: [reply] })
            }
        }
    }

    async createEmoji(guildID: string, hash: string) {

        const emojiImage = await fetch(`https://cdn.discordapp.com/clan-badges/${guildID}/${hash}.png`)
            .then(res => res.arrayBuffer());

        return await SaturnBot.INSTANCE.client.application.emojis.create({
            name: hash.substring(0, 15),
            attachment: Buffer.from(emojiImage)
        })
    }

    async getUser(userID: string, interaction: ChatInputCommandInteraction) {

        if (userID == null) return null;

        return await ApiUtil.wrapAxiosWithEmbedError(interaction, async function () {
            const response = await axios.get(
                `https://discord.com/api/v9/users/${userID}/profile`, {
                headers: {
                    Authorization: SaturnBot.UB_TOKEN,
                }
            });

            return response.data.user;
        }, function (builder, axiosError) {
            const errorData = axiosError.response.data;

            if (errorData && axiosError.response.status != 401) {
                if (errorData["code"] == 10013) {
                    builder.setDescription(`User "${userID}" not found..`)
                } else {
                    builder.setDescription(`Discord returned error "${errorData['message']}", code ${errorData['code']}`)
                }
            }

        });

    }
}