import { z } from "zod";

const Env = z.object({
  BASECAMP_ACCESS_TOKEN: z.string().min(1),
  BASECAMP_ACCOUNT_ID: z.string().regex(/^\d+$/),
  BASECAMP_USER_AGENT: z.string().min(5),
  BASECAMP_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  BASECAMP_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  BASECAMP_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  BASECAMP_APPROVED_ACTIONS: z.string().default("")
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = Env.parse(env);
  return {
    accessToken: v.BASECAMP_ACCESS_TOKEN,
    accountId: v.BASECAMP_ACCOUNT_ID,
    userAgent: v.BASECAMP_USER_AGENT,
    timeoutMs: v.BASECAMP_TIMEOUT_MS,
    maxRetries: v.BASECAMP_MAX_RETRIES,
    requireWriteApproval: v.BASECAMP_REQUIRE_WRITE_APPROVAL === "true",
    approvedActions: new Set(v.BASECAMP_APPROVED_ACTIONS.split(";").map(s => s.trim()).filter(Boolean)),
    baseUrl: `https://3.basecampapi.com/${v.BASECAMP_ACCOUNT_ID}`
  };
}
export type Config = ReturnType<typeof loadConfig>;
