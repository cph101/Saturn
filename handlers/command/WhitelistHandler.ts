import { 
    OmitPartialGroupDMChannel, Message, 
    EmbedBuilder, EmbedAuthorOptions 
} from "discord.js";

import { EventHandler } from "../../api/EventHandler";
import { SuperUsers } from "../../data/SuperUsers";

export class WhitelistHandler extends EventHandler<"messageCreate"> {

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
    
        if (Object.keys(users).includes(message.author.id)) {
            const rankNames = {
                0: "STAFF",
                1: "OWNER",
                2: "FOUNDER"
            }

            setContent: {
                const authorRank = users[message.author.id];
    
                if (message.content.match(/^,(whitelist|wl) ranks$/)) {
                    let description = "";
    
                    for (const user in users) {
                        description += `- <@${user}>: ${rankNames[users[user]]}\n`;
                    }
                    embed.setDescription(description);
                    break setContent;
                }
    
                const addMaybe = message.content.match(/^,(whitelist|wl) add (<@!?(\d{17,20})>|\d{17,20})$/);
                if (addMaybe) {
                    if (authorRank < 1) {
                        embed.setColor(0xED4245);
                        embed.setDescription("Error: you do not have permission to add users to the whitelist.");
                        break setContent;
                    }
    
                    const userId = addMaybe[3] ?? addMaybe[2];
                    const success = await SuperUsers.addAdmin(userId);
                    if (success) {
                        embed.setDescription(`User <@${userId}> was added to the whitelist.`);
                    } else {
                        embed.setDescription(`User <@${userId}> was already on the whitelist.`);
                    }
                    break setContent;
                }
    
                const remMaybe = message.content.match(/^,(whitelist|wl) remove (<@!?(\d{17,20})>|\d{17,20})$/);
                if (remMaybe) {
                    const userId = remMaybe[3] ?? remMaybe[2];
                    const output = await SuperUsers.removeUser(userId, authorRank);
                    if (output == 0) {
                        embed.setDescription(`User <@${userId}> was never on the whitelist to begin with :P`);
                    } else if (output == 1) {
                        embed.setDescription(`User <@${userId}> has rank \`FOUNDER\` and cannot be removed.`);
                    } else if (output == 2) {
                        embed.setDescription(`Error: you do not have permission to remove an \`OWNER\`.`);
                    } else if (output == 3) {
                        embed.setDescription(`Error: you do not have permission to remove \`STAFF\`.`);
                    } else {
                        embed.setDescription(`User <@${userId}> was successfully removed from the whitelist.`);
                    }
                    break setContent;
                }
    
                const promMaybe = message.content.match(/^,(whitelist|wl) promote (<@!?(\d{17,20})>|\d{17,20})$/);
                if (promMaybe) {
                    if (authorRank < 2) {
                        embed.setColor(0xED4245);
                        embed.setDescription("Error: only `FOUNDERS` can promote users to `OWNER`.");
                        break setContent;
                    }
    
                    const userId = promMaybe[3] ?? promMaybe[2];
                    const output = await SuperUsers.promoteToOwner(userId);
                    if (output == 0) {
                        embed.setDescription(`User <@${userId}> is not on the whitelist.`);
                    } else if (output == 1) {
                        embed.setDescription(`User <@${userId}> is already an \`OWNER\`.`);
                    } else {
                        embed.setDescription(`User <@${userId}> was promoted to \`OWNER\`.`);
                    }
                    break setContent;
                }
    
                return;
            }
        } else {
            embed.setColor(0xED4245);
            embed.setTitle("Error: you do not have access to admin commands");
        }
        message.reply({ embeds: [embed] });
    }    
      

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content.startsWith(",whitelist") || message.content.startsWith(",wl")
    }

}