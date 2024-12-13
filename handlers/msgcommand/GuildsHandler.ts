import { 
    ChatInputCommandInteraction, EmbedAuthorOptions, EmbedBuilder, EmbedFooterOptions, Message, OmitPartialGroupDMChannel, SlashCommandBuilder 
} from "discord.js";

import { CommandLikeHandler } from "../../api/command/CommandLikeHandler";
import { Clans } from "../../data/Clans";
import { SaturnBot } from "../..";
import { EventHandler } from "../../api/EventHandler";
import { SuperUsers } from "../../data/SuperUsers";

export class GuildsCommandHandler extends EventHandler<"messageCreate"> {

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        await SuperUsers.refreshUsers();
        const users = SuperUsers.getUsers()

        const author: EmbedAuthorOptions = {
            name: message.author.username,
            iconURL: message.author.avatarURL()
        };
    
        const footer: EmbedFooterOptions = {
            iconURL: "https://cdn.discordapp.com/icons/1244682239187619940/1daabaf95feb6c2463ca8b7cfc951896.webp",
            text: "discord.gg/solarplanet"
        };
    
        let embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0xFFFFFF)

        if (Object.keys(users).includes(message.author.id)) {
            var clanList: string = "";

            if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
                await Clans.refreshCache(null); 
            }
            
            Clans.getClanMemberCounts().forEach(async ({ clan }, index) => {
                clanList += `**\`#${index + 1}\`** <:guild${index + 1}icon:${clan.icon}> **\`#${
                    clan.name.toUpperCase()
                }\`** - **[${index == 9 ? "Soon" : "Apply"}](https://discord.gg/${clan.invite})**\n`;
            });

            embed.setTitle("GUILDS")
            .setDescription(clanList)
        } else {
            embed.setColor(0xED4245);
            embed.setTitle("Error: you do not have access to admin commands")
        }
        message.reply({ embeds: [embed] })
    }

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content == ";guilds";
    }
}