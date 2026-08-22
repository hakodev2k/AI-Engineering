export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

const parseSet = (value?: string) => new Set((value ?? "").split(",").map(x => x.trim()).filter(Boolean));

export class Policy {
  private readonly guilds = parseSet(process.env.DISCORD_ALLOWED_GUILD_IDS);
  private readonly channels = parseSet(process.env.DISCORD_ALLOWED_CHANNEL_IDS);
  private readonly approvals = parseSet(process.env.DISCORD_APPROVED_ACTION_IDS);

  assertGuild(guildId: string) {
    if (this.guilds.size && !this.guilds.has(guildId)) throw new Error(`Guild ${guildId} is not allowlisted`);
  }

  assertChannel(channelId: string) {
    if (this.channels.size && !this.channels.has(channelId)) throw new Error(`Channel ${channelId} is not allowlisted`);
  }

  requireApproval(risk: Risk, approvalId?: string) {
    if (risk === "READ") return;
    if (!approvalId || !this.approvals.has(approvalId)) {
      throw new Error(`${risk} operation requires an out-of-band approved action id`);
    }
  }
}

export const TOOL_RISK: Record<string, Risk> = {
  "discord.guild.get": "READ",
  "discord.guild.channels.list": "READ",
  "discord.channel.get": "READ",
  "discord.messages.list": "READ",
  "discord.message.get": "READ",
  "discord.message.send": "WRITE",
  "discord.message.edit": "WRITE",
  "discord.message.delete": "DESTRUCTIVE",
  "discord.reaction.add": "WRITE",
  "discord.thread.start_from_message": "WRITE",
  "discord.thread.start": "WRITE"
};
