import { Client, REST } from 'discord.js';
import { SaturnEvents } from './api/SaturnEvents';
import 'dotenv/config'

export class SaturnBot {
  public static INSTANCE: SaturnBot = new SaturnBot();
  public static CLIENT_ID: string = process.env.CLIENT_ID || "";
  public static UB_TOKEN: string = process.env.UB_TOKEN || "";

  public api: REST = new REST({ version: '10' });
  public client: Client = new Client({ intents: [] })

  private constructor() {
    if (process.env.TOKEN == null) console.log("Token not found");
    if (process.env.UB_TOKEN == null) console.log("UserBot Token not found");
    if (process.env.CLIENT_ID == null) console.error("Client ID not found");

    this.api.setToken(process.env.TOKEN || "");
    this.client.login(process.env.TOKEN || "");
  }
  
  public static async spawnIn() {
    await SaturnEvents.loadHandlers()
    SaturnEvents.startListening()

    SaturnBot.INSTANCE.client.on('ready', () => {
      console.log("Bot successfully loaded")
    });
    
  }
}

SaturnBot.spawnIn();