import { GuildMember, Invite } from "discord.js";
import { EventHandler } from "../../api/EventHandler";
import { FSDB } from "file-system-db";
import { SaturnBot } from "../..";
import { ResourceDiskWrapper } from "../../data/ResourceDiskWrapper";
import * as fs from "node:fs/promises";
import * as path from "path";
import { Clan } from "../../data/Clans";

export class JoinHandler extends EventHandler<"guildMemberAdd"> {
    static members = new FSDB("resources/members.json");

    async handle(member: GuildMember) {
        const guild = await SaturnBot.INSTANCE.client.guilds.fetch("1244682239187619940")

        await ResourceDiskWrapper.assertExistant("invites.json")
        let invitesOld: Invite[] = JSON.parse(await fs.readFile(
            path.resolve('resources/invites.json'), 
            { encoding: 'utf8' }
        ));
        
        const invitesNew = await guild.invites.fetch()
    }

    handledEvent(): "guildMemberAdd" {
        return "guildMemberAdd";
    }

    async canHandle(member: GuildMember) {
        return false;
    }
    
}