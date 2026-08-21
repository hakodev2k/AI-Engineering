import { describe, expect, it } from "vitest";
import { createSlackServer } from "../src/server.js";
import { loadConfig } from "../src/config.js";

class FakeClient {
  calls: Array<{ method: string; args: Record<string, unknown>; requireUser: boolean }> = [];
  async call(method: string, args: Record<string, unknown> = {}, requireUser = false) {
    this.calls.push({ method, args, requireUser });
    return { ok: true, method, args } as any;
  }
}

describe("MCP tool registration", () => {
  it("registers the expected scoped tools", () => {
    const fake = new FakeClient();
    const config = loadConfig({ SLACK_BOT_TOKEN: "xoxb-test" });
    const server = createSlackServer(config, fake as any) as any;
    const tools = Object.keys(server._registeredTools ?? {});

    expect(tools).toEqual(expect.arrayContaining([
      "slack.auth.test",
      "slack.channel.list",
      "slack.channel.history",
      "slack.thread.replies",
      "slack.user.list",
      "slack.user.get",
      "slack.message.search",
      "slack.message.send",
      "slack.message.update",
      "slack.reaction.add",
      "slack.reaction.remove",
      "slack.channel.create"
    ]));
  });
});
