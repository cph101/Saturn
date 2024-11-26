import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import { SaturnCommand } from "../Commands"
import { ClanCommandList } from "./ClanCommandList"
import { ClanCommandUser } from "./ClanCommandUser"


export class ClanCommand implements SaturnCommand {
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