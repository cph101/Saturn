import { Routes, ChatInputCommandInteraction } from "discord.js";
import { NeptuneBot } from "..";
import { PingCommand } from "./debug/PingCommand";

export interface NeptuneCommand {
    getDescription(): string;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class NeptuneCommands {
    static commands: { [key: string]: NeptuneCommand } = {
        "ping": new PingCommand()
    }

    static async registerAll() {
        await NeptuneBot.INSTANCE.API.put(Routes.applicationCommands(NeptuneBot.INSTANCE.CLIENT_ID), { body:
            Object.fromEntries(
                Object.entries(this.commands).map(([name, command]) => [name, command.getDescription()])
            )
        });
    }
}