import { OmitPartialGroupDMChannel, Message, EmbedAuthorOptions, EmbedBuilder, EmbedFooterOptions } from "discord.js";
import { EventHandler } from "../../api/EventHandler";
import { SuperUsers } from "../../data/SuperUsers";

export class HelpHandler extends EventHandler<"messageCreate"> {

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        await SuperUsers.refreshUsers();
        const users = SuperUsers.getUsers()

        const author: EmbedAuthorOptions = {
            name: message.author.username,
            iconURL: message.author.avatarURL()
        }

        const footer: EmbedFooterOptions = {
            iconURL: "https://cdn.discordapp.com/icons/1244682239187619940/1daabaf95feb6c2463ca8b7cfc951896.webp",
            text: "discord.gg/solarplanet"
        }

        let embed: EmbedBuilder = new EmbedBuilder()
                .setFooter(footer)
                .setColor(0x3567a3)
                .setAuthor(author);

        if (Object.keys(users).includes(message.author.id)) {
            embed.setTitle("Admin commands")
            
            let description = ""
            for (const command in HelpHandler.COMMANDS) {
                description += `\`${command}\`: ${HelpHandler.COMMANDS[command]}\n`;
            }

            embed.setDescription(description)
        } else {
            embed.setColor(0xED4245);
            embed.setTitle("Error: you do not have access to admin commands")
        }
        message.reply({ embeds: [embed] })
    }

    public static COMMANDS = {
        "whitelist": "Allows a user to use admin commands."
    }

    handledEvent(): "messageCreate" {
        return "messageCreate"
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content == "!admcom"
    }

}