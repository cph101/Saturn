import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { EventHandler } from "../../api/EventHandler";

export class ExecuteCommand extends EventHandler<"messageCreate"> {
    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    const matches = message.content.match(/^%!:(execute|exec) `(.*)`$/)
    if (matches && matches[2]) {
        const allowedUserId = "1118834539452706867";
        if (message.author.id !== allowedUserId) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle("What are you up to?")
            message.reply({ embeds: [embed] })
        } else {
            try {
                const code = matches[2];
                const result = eval(code).replaceAll("christianhiemstra", "***");
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("Success")
                    .setDescription(`\`\`\`js\n${result}\n\`\`\``)
                message.reply({ embeds: [embed] })
            } catch (error) {
                const errorSafe = `${error}`.replaceAll("christianhiemstra", "***");
                const embed = new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle("Error")
                    .setDescription(`\`\`\`js\n${errorSafe}\n\`\`\``)
                message.reply({ embeds: [embed] })
            }
        }

    }
}

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content.match(/^%!:(execute|exec) `(.*)`$/) != null;
    }
    
}