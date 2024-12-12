import { OmitPartialGroupDMChannel, Message, EmbedBuilder, EmbedFooterOptions, EmbedAuthorOptions } from "discord.js";
import { EventHandler } from "../../api/EventHandler";
import { SuperUsers } from "../../data/SuperUsers";

export class WhitelistHandler extends EventHandler<"messageCreate"> {

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
            setContent: {
                if (users[message.author.id] != "OWNER") {
                    embed.setColor(0xED4245);
                    embed.setDescription("Error: you have access to admin commands but do not posess the `OWNER` rank.")
                    break setContent;
                } 
                if (message.content == "!whitelist ranks") {
                    let description = "";

                    for (const user in users) {
                        description += `- <@${user}>: ${users[user]}\n`
                    }
                    embed.setDescription(description)
                    break setContent;
                }
                const addMaybe = message.content.match(/^!whitelist add (\d{17,20})$/)
                if (addMaybe) {
                    const success = await SuperUsers.addAdmin(addMaybe[1])
                    if (success) {
                        embed.setDescription(`User <@${addMaybe[1]}> was added to the whitelist`)
                    } else {
                        embed.setDescription(`User <@${addMaybe[1]}> was already on the whitelist`)
                    }
                    break setContent;
                }

                const remMaybe = message.content.match(/^!whitelist remove (\d{17,20})$/)
                if (remMaybe) {
                    const output = await SuperUsers.removeUser(remMaybe[1])
                    if (output == 0) {
                        embed.setDescription(`User <@${remMaybe[1]}> was never on the whitelist to begin with :P`)
                    } else if (output == 1) {
                        embed.setDescription(`User <@${remMaybe[1]}> has rank \`OWNER\` and can only be removed by GOD!!`)
                    } else {
                        embed.setDescription(`User <@${remMaybe[1]}> was successfully removed from the whitelist. Rest in peices, <@${remMaybe[1]}>!`)
                    }
                    break setContent;
                }

                
                embed.setTitle("!whitelist usage")
                embed.setDescription(`
                    - **whitelist ranks**: Logs all whitelisted users and their rank\n- **whitelist add** \`userID\`: Set a user as whitelisted\n- **whitelist remove** \`userID\`: Remove a user from the whitelist.
                `)
            }
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
        return message.content.slice(0, 10) == "!whitelist"
    }

}