import { z } from 'zod';

const bool = z.enum(['true', 'false']).transform(v => v === 'true');

const EnvSchema = z.object({
  BUGSNAG_AUTH_TOKEN: z.string().min(1),
  BUGSNAG_PROJECT_API_KEY: z.string().min(1).optional(),
  BUGSNAG_ENDPOINT: z.string().url().optional(),
  BUGSNAG_UPSTREAM_COMMAND: z.string().min(1).default('npx'),
  BUGSNAG_UPSTREAM_PACKAGE: z.string().min(1).default('@smartbear/mcp@latest'),
  BUGSNAG_UPSTREAM_START_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  BUGSNAG_TOOL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  BUGSNAG_REQUIRE_WRITE_APPROVAL: bool.default('true')
});

export type Config = z.infer<typeof EnvSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return EnvSchema.parse(env);
}

export function upstreamEnv(config: Config): NodeJS.ProcessEnv {
  const result: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    USERPROFILE: process.env.USERPROFILE,
    BUGSNAG_AUTH_TOKEN: config.BUGSNAG_AUTH_TOKEN
  };
  if (config.BUGSNAG_PROJECT_API_KEY) result.BUGSNAG_PROJECT_API_KEY = config.BUGSNAG_PROJECT_API_KEY;
  if (config.BUGSNAG_ENDPOINT) result.BUGSNAG_ENDPOINT = config.BUGSNAG_ENDPOINT;
  return result;
}
