import {
    EmbedBuilder, EmbedAuthorOptions,
    Message, OmitPartialGroupDMChannel,
} from "discord.js";

import axios from "axios";
import { Clan, Clans } from "../../data/Clans";
import { ClanDetails } from "../../api/clan/ClanDetails";
import { SaturnBot } from "../..";
import { EventHandler } from "../../api/EventHandler";
import { SuperUsers } from "../../data/SuperUsers";
import { AssertionError } from "assert";

export class AcceptHandler extends EventHandler<"messageCreate"> {

    static commandRan = 0

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        await SuperUsers.refreshUsers();
        const users = SuperUsers.getUsers();

        const author: EmbedAuthorOptions = {
            name: message.author.username,
            iconURL: message.author.avatarURL()
        };

        let embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setAuthor(author);

        if (!Object.keys(users).includes(message.author.id)) {
            embed.setColor(0xED4245);
            embed.setTitle("Error: you do not have access to admin commands");

            await message.reply({ embeds: [embed] });
            return;
        }

        const args = message.content.match(/^,(accept|ax) (<@!?(\d{17,20})>|\d{17,20}) (.*)$/);
        const member = args[3] ?? args[2];
        const guild = args[4];

        if (!guild) return;

        embed.setColor(0xFFD700)
            .setDescription("Accepting, please wait...");
        const waitingMessage = await message.reply({ embeds: [embed] });

        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(null);
        }

        const guildData = Clans.getClanMemberCounts().map(({ clan }) => clan).find(candidate => {
            if (candidate.name.toLowerCase() == guild.toLowerCase()) return true;
            return guild.toLowerCase() == "long" && candidate.id == "966137238880682145";
        });

        if (!guildData) {
            embed.setColor(0xED4245)
            embed.setDescription(`No such guild, \`${guild}\``);
            await waitingMessage.edit({ embeds: [embed] });
            return;
        }

        AcceptHandler.commandRan = Date.now();
        const application = await this.fetchApplication(guildData, message, "", member);

        const guildInfo: ClanDetails = await ClanDetails.get(guildData.id);

        if (application) {
            await this.tryAccept(application["id"], application["guild_id"]);
            embed.setColor(0xFFFFFF)
            if (guildData.name.toLowerCase() == "hail") {
                embed.setDescription(`<@${member}> (\`${member}\`) was accepted into <:HAIL:1311970450112249896>**\`#${guildData.name}\`**`);
                await waitingMessage.edit({ embeds: [embed] });
            } else {
                await guildInfo.withIconImage(async (emoji) => {
                    embed.setDescription(`<@${member}> (\`${member}\`) was accepted into <:${emoji?.name}:${emoji?.id}>**\`#${guildData.name}\`**`);
                    await waitingMessage.edit({ embeds: [embed] });
                });
            }
            const guild = await SaturnBot.INSTANCE.client.guilds.fetch("1244682239187619940")
            const channel = await guild.channels.fetch("1318103113663647875");
            if (channel.isSendable()) {
                embed.setDescription(`<@${member}> (\`${member}\`) was accepted into **\`#${guildData.name}\`** by <@${message.author.id}>`);
                await channel.send({ embeds: [embed] });
            } else {
                throw new AssertionError()
            }
        } else {
            if (guildData.name.toLowerCase() == "hail") {
                embed.setDescription(`No application was found for <@${member}> (\`${member}\`) in <:HAIL:1311970450112249896>**\`#${guildData.name}\`** or the bot timed out.`);
                await waitingMessage.edit({ embeds: [embed] });
            } else {
                await guildInfo.withIconImage(async (emoji) => {
                    embed.setColor(0xED4245)
                        .setDescription(`No application was found for <@${member}> (\`${member}\`) in <:${emoji.name}:${emoji.id}>**\`#${guildData.name}\`** or the bot timed out.`);
                    await waitingMessage.edit({ embeds: [embed] });
                });
            }
        }

    }

    async fetchApplication(guildData: Clan, interaction: OmitPartialGroupDMChannel<Message<boolean>>, before: string, userID: string) {
        if (Date.now() - AcceptHandler.commandRan >= 20000) return null;

        const response = await axios.get(
            `https://discord.com/api/v9/guilds/${guildData.id}/requests?status=SUBMITTED${before != "" ? "&before=" + before : ""}`,
            {
                headers: {
                    Authorization: SaturnBot.UB_TOKEN,
                }
            }
        )

        const joinReqs: Object[] = response.data["guild_join_requests"]
        const maybe = joinReqs.find(obj => obj["user"]["id"] == userID)

        if (!maybe) {
            if (joinReqs.reverse()[0] && joinReqs.reverse()[0]["id"]) {
                return await this.fetchApplication(guildData, interaction, joinReqs.reverse()[0]["id"], userID)
            }
        }
        return maybe;
    }

    async tryAccept(joinReqID: string, guildID: string) {
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
        );
    }

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content.match(/^,(accept|ax) (<@!?(\d{17,20})>|\d{17,20}) .*$/) != null;
    }

}
