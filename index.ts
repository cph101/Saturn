import { Client, Guild, REST } from 'discord.js';
import 'dotenv/config'
import { SaturnEvents } from './api/SaturnEvents';
import { ResourceDiskWrapper } from './data/ResourceDiskWrapper';

export class SaturnBot {
  public static INSTANCE: SaturnBot = new SaturnBot();
  public static CLIENT_ID: string = process.env.CLIENT_ID || "";
  public static UB_TOKEN: string = process.env.UB_TOKEN || "";

  public static DEBUG_MODE = false;

  public API: REST = new REST({ version: '10' });
  // @ts-expect-error
  public uAPI: REST = new REST({ version: '9', authPrefix: "" });
  public client: Client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] })

  private constructor() {
    if (process.env.TOKEN == null) console.log("Token not found");
    if (process.env.UB_TOKEN == null) console.log("UserBot Token not found");
    if (process.env.CLIENT_ID == null) console.error("Client ID not found");

    this.API.setToken(process.env.TOKEN || "");
    this.uAPI.setToken(process.env.UB_TOKEN || "");
    this.client.login(process.env.TOKEN || "");
  }
  
  public static async spawnIn() {
    await SaturnEvents.loadHandlers()
    SaturnEvents.startListening()

    SaturnBot.INSTANCE.client.on('ready', async () => {
      console.log("Bot successfully loaded")
    });
    
  }
}

SaturnBot.spawnIn();