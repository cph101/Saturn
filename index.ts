import { ChatInputCommandInteraction, Client, GatewayIntentBits, REST } from 'discord.js';
import { NeptuneCommands } from './interaction/Commands';
import 'dotenv/config'

export class NeptuneBot {
  public static INSTANCE = new NeptuneBot();
  public static CLIENT_ID: string = process.env.CLIENT_ID || "";

  public api: REST = new REST({ version: '10' });
  public client = new Client({ intents: [] })

  private constructor() {
    if (process.env.TOKEN == null) console.log("Token not found");
    if (process.env.CLIENT_ID == null) console.error("Client ID not found");

    this.api.setToken(process.env.TOKEN || "");
    this.client.login(process.env.TOKEN || "");
  }
  
  public static spawnIn() {
    console.log("Registering commands")
    NeptuneCommands.registerAll();

    NeptuneBot.INSTANCE.client.on('ready', () => {
      console.log("Bot successfully loaded")
    });
    
  }
}

NeptuneBot.spawnIn();