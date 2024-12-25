import { Invite } from "discord.js";
import { EventHandler } from "../../api/EventHandler";

export class InviteHandler extends EventHandler<"inviteCreate"> {
    handle(invite: Invite): Promise<void> {
        throw new Error("Method not implemented.");
    }

    handledEvent(): "inviteCreate" {
        return "inviteCreate";
    }
    
    async canHandle(invite: Invite) {
        return false;
    }
    
}