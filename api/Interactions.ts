import { InteractionHandler } from "./InteractionHandler";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export class SaturnInteractions {

    private static handlers: {
        [key: string]: (new (...args: any[]) => InteractionHandler<any>)[]
    } = {}

    static async startListening() {

        console.log(this.handlers)
        console.log(new this.handlers["ButtonInteraction"][0]().handledType())

        /*await SaturnBot.INSTANCE.api.put(Routes.applicationCommands(SaturnBot.CLIENT_ID), { body:
            this.commands.map(c => c.makeCommand().toJSON())
        });

        SaturnBot.INSTANCE.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand) return;
            const cInteraction = interaction.isChatInputCommand ? (interaction as ChatInputCommandInteraction) : null;
            const bInteraction = interaction.isButton ? (interaction as ButtonInteraction) : null;
            const SSMInteraction = interaction.isStringSelectMenu ? (interaction as StringSelectMenuInteraction) : null;

            if (SSMInteraction && SSMInteraction.customId?.split("::")[0] == "applyToClan") {
                ClanApply.applyToClan(SSMInteraction);
                return;
            }
            
            const button = this.getBtn(bInteraction.customId?.split("::")[0])
            if (button) { button.handle(bInteraction); return; }
            
            const command = this.getCommand(cInteraction.commandName?.split("::")[0])
            if (command) { command.handle(cInteraction); return; }

            if (bInteraction && !button) cInteraction.reply({ content: `Invalid Button: ${bInteraction.customId}` })
            if (cInteraction && !command) cInteraction.reply({ content: `Command not found: ${cInteraction.commandName}` })
        })*/
    }

    static async loadHandlers(): Promise<void> {

        const files = await this.getAllFiles("dist/handlers");

        for (const file of files) {
            const module = await import("../../" + file);
            for (const handlerClass of Object.values(module)) {
                if (typeof handlerClass === "function" && handlerClass.prototype instanceof InteractionHandler) {
                    const constructor = handlerClass as new (...args: any[]) => InteractionHandler<any>;
                    const instance: InteractionHandler<any> = new constructor();

                    if (this.handlers[instance.handledType()] == null) {
                        this.handlers[instance.handledType()] = []
                    }

                    this.handlers[instance.handledType()].push(
                        handlerClass as new (...args: any[]) => InteractionHandler<any>
                    )
                }
            }
        }
    }

    private static async getAllFiles(dir: string, files: string[] = []): Promise<string[]> {

        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await this.getAllFiles(fullPath, files);
            } else if (entry.name.endsWith(".js")) {
                files.push(fullPath);
            }
        }
        return files;
    }
}
