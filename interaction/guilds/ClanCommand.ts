import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { NeptuneCommand } from "../Commands";
import { ClanCommandUser } from "./ClanCommandUser";
import { ClanCommandList } from "./ClanCommandList";

export class ClanCommand implements NeptuneCommand {
    makeCommand(): SlashCommandSubcommandsOnlyBuilder {
        return new SlashCommandBuilder().setName("guild")
            .setDescription("Get information relating to Guilds")
            //.addSubcommand(new ClanCommandUser().makeSubCommand())
            .addSubcommand(new ClanCommandList().makeSubCommand())
    }

    async handle(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "user": new ClanCommandUser().handle(interaction)
            case "list": new ClanCommandList().handle(interaction)
        }
    }
}