import * as fs from "node:fs/promises";
import * as path from "node:path";
import { EventHandler } from "./EventHandler";
import { ClientEvents, Routes, SlashCommandBuilder } from "discord.js";
import { SaturnBot } from "..";
import { CommandLikeHandler } from "./command/CommandLikeHandler";

export class SaturnEvents {

    private static handlers: {
        [K in keyof ClientEvents]?: (new () => EventHandler<K>)[];
    } = {};

    static async startListening() {

        let commands = [];

        Object.entries(this.handlers).forEach(handlerData => {
            for (const possibleHandlerClass of handlerData[1]) {
                const possibleHandler: EventHandler<any> = new possibleHandlerClass();
                if (possibleHandler instanceof CommandLikeHandler) {
                    const representation = possibleHandler.buildRepresentable();
                    if (representation instanceof SlashCommandBuilder) {
                        commands.push(representation.toJSON());
                    }
                }
    
            }
        })

        await SaturnBot.INSTANCE.api.put(
            Routes.applicationCommands(SaturnBot.CLIENT_ID), { body: commands }
        );

        Object.entries(this.handlers).forEach(handlerData => {
            SaturnBot.INSTANCE.client.on(handlerData[0], async event => {
                for (const possibleHandlerClass of handlerData[1]) {
                    const possibleHandler: EventHandler<any> = new possibleHandlerClass();
                    if (possibleHandler.canHandle(event)) {
                        console.log(`Attempting to use ${possibleHandlerClass}`)
                        possibleHandler.handle(event);
                        break;
                    }
                }
            });
        })
    }

    static async loadHandlers(): Promise<void> {

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
