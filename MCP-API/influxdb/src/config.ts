import { z } from 'zod';

const Product = z.enum(['core', 'enterprise', 'cloud-serverless', 'cloud-dedicated', 'clustered']);

export type Config = {
  instanceUrl: string;
  token: string;
  productType: z.infer<typeof Product>;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env = process.env): Config {
  const instanceUrl = z.string().url().parse(env.INFLUX_DB_INSTANCE_URL);
  const token = z.string().min(1).parse(env.INFLUX_DB_TOKEN);
  const productType = Product.parse(env.INFLUX_DB_PRODUCT_TYPE ?? 'core');
  const timeoutMs = z.coerce.number().int().min(1000).max(120000).parse(env.INFLUX_CONNECTOR_TIMEOUT_MS ?? 20000);
  const approvalSecret = env.INFLUX_CONNECTOR_APPROVAL_SECRET?.trim() || undefined;
  return { instanceUrl, token, productType, approvalSecret, timeoutMs };
}
