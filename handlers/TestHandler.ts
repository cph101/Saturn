import { ButtonInteraction } from "discord.js";
import { InteractionHandler } from "../api/InteractionHandler";

export class TestHandler extends InteractionHandler<ButtonInteraction> {
  canAccept(interaction: ButtonInteraction): boolean {
    return true;
  }

  handledType(): string {
    return "ButtonInteraction";
  }

  async handle(interaction: ButtonInteraction): Promise<void> {
    console.log("Handled ButtonInteraction:", interaction.customId);
  }
}
