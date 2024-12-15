import {
    ChatInputCommandInteraction, User, EmbedBuilder, 
    Message,
    OmitPartialGroupDMChannel,
} from "discord.js";

import axios from "axios";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { ExtendedUser } from "../../api/user/ExtendedUser";
import { ClanDetails } from "../../api/clan/ClanDetails";
import { ApiUtil } from "../../data/ApiUtil";
import { SaturnBot } from "../..";
import { EventHandler } from "../../api/EventHandler";

export class GuildsQueryHandler extends EventHandler<"messageCreate"> {
    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        const args = message.content.match(/^,query (<@!?(\d{17,20})>|\d{17,20})$/);
        const member = args[2] ?? args[1];

        const user = await ExtendedUser.fetch(member)

            if (user.clan() && user.clan().identity_guild_id) {
                ClanDetails.withIconImage(
                    user.clan().identity_guild_id, user.clan().badge, async (emoji) => {

                        let CLANS: string[] = JSON.parse(await fs.readFile(
                            path.resolve('resources/SolarPlanetGuilds.json'),
                            { encoding: 'utf8' }
                        )).values.map(clan => clan["id"]);

                        const isSPOwned: boolean = CLANS.includes(user.clan().identity_guild_id);

                        const reply: EmbedBuilder = new EmbedBuilder()
                            .setColor(0xFFFFFF)

                        reply.setTitle(user.username() + "'s clan")
                        reply.setDescription(`<:${emoji.name}:${emoji.id}> **${user.clan().tag}** - ${isSPOwned ? "Owned" : "Not owned"} by Solarplanet`)

                        await message.reply({ embeds: [reply] })
                    });
            } else {
                const reply = new EmbedBuilder()
                    .setColor(0xFFFFFF)

                reply.setTitle(user.username() + " does not belong to any clan")

                message.reply({ embeds: [reply] })
            }
    }

    async getUser(userID: string, interaction: ChatInputCommandInteraction): Promise<User> {

        if (userID == null) return null;

        return await ApiUtil.wrapAxiosWithEmbedError(interaction, async () => {
            const response = await axios.get(
                `https://discord.com/api/v9/users/${userID}/profile`, {
                headers: {
                    Authorization: SaturnBot.UB_TOKEN,
                }
            });

            return response.data.user;
        }, (builder, axiosError) => {
            const errorData = axiosError.response.data;

            if (errorData && axiosError.response.status != 401) {
                if (errorData["code"] == 10013) {
                    builder.setDescription(`User "${userID}" not found..`)
                    return false;
                } else {
                    builder.setDescription(`Discord returned error "${errorData['message']}", code ${errorData['code']}`)
                    return true;
                }
            }

        });

    }

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content.match(/^,query (<@!?(\d{17,20})>|\d{17,20})$/) != null;
    }

}