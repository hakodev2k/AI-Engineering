import { z } from "zod";

const Env = z.object({
  STORYBLOK_TOKEN: z.string().min(1),
  STORYBLOK_SPACE_ID: z.string().regex(/^\d+$/),
  STORYBLOK_REGION: z.enum(["eu", "us", "ca", "ap", "cn"]).default("eu"),
  STORYBLOK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  STORYBLOK_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  STORYBLOK_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  STORYBLOK_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  STORYBLOK_APPROVED_ACTIONS: z.string().default("")
});

const bases: Record<string, string> = {
  eu: "https://mapi.storyblok.com/v1",
  us: "https://api-us.storyblok.com/v1",
  ca: "https://api-ca.storyblok.com/v1",
  ap: "https://api-ap.storyblok.com/v1",
  cn: "https://app.storyblokchina.cn/v1"
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = Env.parse(env);
  return {
    token: v.STORYBLOK_TOKEN,
    spaceId: v.STORYBLOK_SPACE_ID,
    baseUrl: bases[v.STORYBLOK_REGION],
    timeoutMs: v.STORYBLOK_TIMEOUT_MS,
    maxRetries: v.STORYBLOK_MAX_RETRIES,
    requireWriteApproval: v.STORYBLOK_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: v.STORYBLOK_ALLOW_DESTRUCTIVE === "true",
    approvedActions: new Set(v.STORYBLOK_APPROVED_ACTIONS.split(";").map(x => x.trim()).filter(Boolean))
  };
}
export type Config = ReturnType<typeof loadConfig>;
