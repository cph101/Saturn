import * as fs from "node:fs/promises";
import * as path from "node:path";
import { EventHandler } from "./EventHandler";
import { ClientEvents, Routes, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SaturnBot } from "..";
import { CommandLikeHandler } from "./command/CommandLikeHandler";
import { CommandTreeHandler } from "./command/CommandTreeHandler";

export class SaturnEvents {

    private static handlers: {
        [K in keyof ClientEvents]?: (new () => EventHandler<K>)[];
    } = {};

    static async startListening() {
        Object.entries(this.handlers).forEach(handlerData => {
            SaturnBot.INSTANCE.client.on(handlerData[0], async event => {
                for (const possibleHandlerClass of handlerData[1]) {
                    //console.info(`Testing candidate ${possibleHandlerClass.name}`)
                    const possibleHandler: EventHandler<any> = new possibleHandlerClass();
                    if (await possibleHandler.canHandle(event)) {
                        //console.info(`Attempting to use ${possibleHandlerClass.name}`)
                        try {
                            possibleHandler.handle(event);
                        } catch (error) {
                            console.error(error) // prevent fatal
                        }
                        break;
                    }
                }
            });
        })
    }

    static async loadHandlers(): Promise<void> {

        this.handlers = {}

        const files = await this.getAllFiles("dist/handlers");

        for (const file of files) {
            const module = await import("../../" + file);
            for (const handlerClass of Object.values(module)) {
                if (typeof handlerClass === "function" && handlerClass.prototype instanceof EventHandler) {
                    const constructor = handlerClass as new (...args: any[]) => EventHandler<any>;
                    const instance: EventHandler<any> = new constructor();

                    if (this.handlers[instance.handledEvent()] == null) {
                        this.handlers[instance.handledEvent()] = []
                    }

                    this.handlers[instance.handledEvent()].push(
                        handlerClass as new (...args: any[]) => EventHandler<any>
                    )
                }
            }
        }

        let commands = [];

        Object.entries(this.handlers).forEach(handlerData => {
            for (const possibleHandlerClass of handlerData[1]) {
                // Instantiante handler and create representation
                const possibleHandler: EventHandler<any> = new possibleHandlerClass();
                if (possibleHandler instanceof CommandLikeHandler) {
                    var representation = possibleHandler.buildRepresentable();
                    if (representation instanceof SlashCommandBuilder) {
                        // Add subcommands if applicable
                        if (possibleHandler instanceof CommandTreeHandler) {
                            possibleHandler.subcommands().forEach(sub => {
                                representation = (representation as SlashCommandBuilder)
                                    .addSubcommand(new sub().buildRepresentable())
                            });
                        }
                        // Add command to list
                        commands.push(representation)
                    }
                }
    
            }
        })

        await SaturnBot.INSTANCE.api.put(
            Routes.applicationCommands(SaturnBot.CLIENT_ID), { body: commands }
        );
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
