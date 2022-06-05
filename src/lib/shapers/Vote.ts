import { container } from "@sapphire/framework";
import type { Snowflake, User } from "discord.js";

export class VotePayload {
  constructor(
    private raw: {
      userSnowflake: Snowflake;
      test: boolean;
      serviceName: string;
      voteLink: string;
      emoji: string;
    }
  ) {}

  public user: User | null = null;
  public readonly test: boolean = this.raw.test;
  public readonly serviceName: string = this.raw.serviceName;
  public readonly voteLink: string = this.raw.voteLink;
  public readonly voteHyperlink: string = `[${this.serviceName}](${this.voteLink})`;
  public readonly emoji: string = this.raw.emoji;

  public async init() {
    this.user = await container.client.users
      .fetch(this.raw.userSnowflake)
      .catch(() => null);
  }
}
