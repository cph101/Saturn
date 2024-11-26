import { ChatInputCommandInteraction, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption, SnowflakeUtil, User, UserManager } from "discord.js";
import { NeptuneSubCommand } from "../Commands";
import { NeptuneBot } from "../..";

export class ClanCommandUser implements NeptuneSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("user").setDescription("Gets guild information about the specified user, or the command sender")
            .addUserOption(new SlashCommandUserOption().setName("name").setDescription("User name to get guild info about").setRequired(false))
            .addStringOption(new SlashCommandStringOption().setName("id").setDescription("User id to get guild info about").setRequired(false))
    }

    async handle(interaction: ChatInputCommandInteraction) {
        let name: User = interaction.options.getUser("name") ?? interaction.user;
        let id: string = interaction.options.getString("id")

        let manager: UserManager = NeptuneBot.INSTANCE.client.users;

        console.log(manager.resolve(id ?? name).toJSON())
    }
}