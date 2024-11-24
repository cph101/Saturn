import { REST } from 'discord.js';
import { NeptuneCommands } from './interaction/Commands';

export class NeptuneBot {
  public static INSTANCE = new NeptuneBot();

  public CLIENT_ID: string = process.env.CLIENT_ID || "";
  public API: REST = new REST({ version: '10' });

  private constructor() {
    if (process.env.TOKEN === null) console.error("Token not found");
    if (process.env.CLIENT_ID === null) console.error("Client ID not found");
    this.API.setToken(process.env.TOKEN || "");
  }

  public static spawnIn() {
    NeptuneCommands.registerAll();
  }
}

NeptuneBot.spawnIn();