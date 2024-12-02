import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import { ClanCommandList } from "./list/ClanCommandList"
import { ClanCommandUser } from "./ClanCommandUser"
import { ClanCommandAccept } from "./acceptance/ClanCommandAccept"


export class ClanCommand {
    makeCommand(): SlashCommandSubcommandsOnlyBuilder {
        return new SlashCommandBuilder().setName("guild")
            .setDescription("Get information relating to Guilds")
            .addSubcommand(new ClanCommandUser().makeSubCommand())
            .addSubcommand(new ClanCommandList().makeSubCommand())
            //.addSubcommand(new ClanCommandAccept().makeSubCommand())
    }

    async handle(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "user": new ClanCommandUser().handle(interaction); break;
            case "list": new ClanCommandList().handle(interaction); break;
            case "accept": new ClanCommandAccept().handle(interaction); break;
        }
    }
}