import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'digitalocean.account.get': { risk: 'READ', approval: false },
  'digitalocean.region.list': { risk: 'READ', approval: false },
  'digitalocean.droplet.list': { risk: 'READ', approval: false },
  'digitalocean.droplet.get': { risk: 'READ', approval: false },
  'digitalocean.droplet.create': { risk: 'WRITE', approval: true },
  'digitalocean.droplet.reboot': { risk: 'HIGH_RISK', approval: true },
  'digitalocean.droplet.power_on': { risk: 'HIGH_RISK', approval: true },
  'digitalocean.droplet.power_off': { risk: 'HIGH_RISK', approval: true },
  'digitalocean.droplet.snapshot': { risk: 'WRITE', approval: true },
  'digitalocean.firewall.list': { risk: 'READ', approval: false },
  'digitalocean.firewall.get': { risk: 'READ', approval: false },
  'digitalocean.firewall.create': { risk: 'HIGH_RISK', approval: true },
  'digitalocean.firewall.add_droplets': { risk: 'HIGH_RISK', approval: true }
};

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, provided: string | undefined, secret: string | undefined) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires DIGITALOCEAN_APPROVAL_SECRET`);
  const expected = approvalDigest(secret, tool);
  if (!provided || provided.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    throw new Error(`Explicit approval required for ${tool}`);
  }
}
