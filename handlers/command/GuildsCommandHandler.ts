import { SlashCommandBuilder } from "discord.js";
import { CommandTreeHandler } from "../../api/command/CommandTreeHandler";
import { SubCommandHandler } from "../../api/command/SubCommandHandler";
import { GuildsListHandler } from "./guilds/GuildsListHandler";
import { GuildsFetchHandler } from "./guilds/GuildsFetchHandler";

export class GuildsCommandHandler extends CommandTreeHandler {

    buildRepresentable(): SlashCommandBuilder {
        return new SlashCommandBuilder().setName("guilds")
            .setDescription("Get information relating to Guilds")
    }

    subcommands(): (new () => SubCommandHandler)[] {
        return [GuildsListHandler, GuildsFetchHandler];
    }
}