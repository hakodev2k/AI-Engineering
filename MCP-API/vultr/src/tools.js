import { z } from "zod";
import { assertPermission, payloadWithoutApproval, TOOL_RISKS } from "./policy.js";

const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const region = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/);
const short = z.string().min(1).max(255);
const approvalToken = z.string().max(128).optional();
const page = {
  perPage: z.number().int().min(1).max(100).optional(),
  cursor: z.string().max(512).optional()
};

function q(args) { return { per_page: args.perPage, cursor: args.cursor }; }
function pathId(value) { return encodeURIComponent(value); }
function policy(tool, args, config) { assertPermission(tool, args, config); }
function clean(args) { return payloadWithoutApproval(args); }

export const TOOL_NAMES = Object.freeze(Object.keys(TOOL_RISKS));

export function registerVultrTools(server, client, config) {
  const add = (name, description, shape, handler) => server.tool(name, `${description} Risk: ${TOOL_RISKS[name]}.`, shape, async (args, extra) => {
    policy(name, args, config);
    try {
      const result = await handler(args, extra?.signal);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: String(error?.message || error).slice(0, 4000) }] };
    }
  });

  add("vultr.instance.list", "List compute instances with bounded pagination.", { ...page, label: short.optional(), tag: short.optional() }, (a, signal) => client.get("/instances", { query: { ...q(a), label: a.label, tag: a.tag }, signal }));
  add("vultr.instance.get", "Read one compute instance. Secret-shaped provider fields are redacted.", { instanceId: id }, (a, signal) => client.get(`/instances/${pathId(a.instanceId)}`, { signal }));
  add("vultr.region.list", "List Vultr regions.", { ...page }, (a, signal) => client.get("/regions", { query: q(a), signal }));
  add("vultr.region.availability", "List plans currently available in a region.", { regionId: region }, (a, signal) => client.get(`/regions/${pathId(a.regionId)}/availability`, { signal }));
  add("vultr.plan.list", "List compute plans.", { ...page, type: z.string().max(64).optional() }, (a, signal) => client.get("/plans", { query: { ...q(a), type: a.type }, signal }));
  add("vultr.os.list", "List operating-system images.", { ...page }, (a, signal) => client.get("/os", { query: q(a), signal }));
  add("vultr.ssh_key.list", "List SSH public-key resources and metadata.", { ...page }, (a, signal) => client.get("/ssh-keys", { query: q(a), signal }));
  add("vultr.firewall_group.list", "List firewall groups.", { ...page }, (a, signal) => client.get("/firewalls", { query: q(a), signal }));
  add("vultr.firewall_rule.list", "List rules for one firewall group.", { firewallGroupId: id, ...page }, (a, signal) => client.get(`/firewalls/${pathId(a.firewallGroupId)}/rules`, { query: q(a), signal }));
  add("vultr.snapshot.list", "List instance snapshots.", { ...page }, (a, signal) => client.get("/snapshots", { query: q(a), signal }));

  add("vultr.instance.tags.update", "Replace the tags on one instance. Requires payload-bound approval by default.", {
    instanceId: id,
    tags: z.array(z.string().min(1).max(64)).max(20),
    approvalToken
  }, (a, signal) => client.patch(`/instances/${pathId(a.instanceId)}`, { tags: a.tags }, { signal }));

  add("vultr.instance.create", "Provision a new billable compute instance. Explicit human approval and HIGH_RISK enablement are required.", {
    region: region,
    plan: short,
    osId: z.number().int().positive().optional(),
    snapshotId: id.optional(),
    label: short.optional(),
    hostname: short.optional(),
    sshKeyIds: z.array(id).max(10).optional(),
    enableIpv6: z.boolean().optional(),
    backups: z.enum(["enabled", "disabled"]).optional(),
    tags: z.array(z.string().min(1).max(64)).max(20).optional(),
    approvalToken
  }, async (a, signal) => {
    if (Number(Boolean(a.osId)) + Number(Boolean(a.snapshotId)) !== 1) throw new Error("Exactly one of osId or snapshotId is required");
    const p = clean(a);
    return client.post("/instances", {
      region: p.region, plan: p.plan, os_id: p.osId, snapshot_id: p.snapshotId,
      label: p.label, hostname: p.hostname, sshkey_id: p.sshKeyIds,
      enable_ipv6: p.enableIpv6, backups: p.backups, tags: p.tags
    }, { signal });
  });

  add("vultr.instance.reboot", "Reboot exactly one instance using Vultr's reboot operation. Explicit human approval and HIGH_RISK enablement are required.", { instanceId: id, approvalToken }, (a, signal) => client.post("/instances/reboot", { instance_ids: [a.instanceId] }, { signal }));
  add("vultr.snapshot.create", "Create an instance snapshot, which consumes storage and may affect operational workflows.", { instanceId: id, description: z.string().min(1).max(255), approvalToken }, (a, signal) => client.post("/snapshots", { instance_id: a.instanceId, description: a.description }, { signal }));

  add("vultr.instance.delete", "Permanently delete one compute instance. Disabled by default and requires exact-ID confirmation plus approval.", { instanceId: id, confirmId: id, approvalToken }, async (a, signal) => {
    if (a.confirmId !== a.instanceId) throw new Error("confirmId must exactly match instanceId");
    return client.delete(`/instances/${pathId(a.instanceId)}`, { signal });
  });
  add("vultr.snapshot.delete", "Permanently delete one instance snapshot. Disabled by default and requires exact-ID confirmation plus approval.", { snapshotId: id, confirmId: id, approvalToken }, async (a, signal) => {
    if (a.confirmId !== a.snapshotId) throw new Error("confirmId must exactly match snapshotId");
    return client.delete(`/snapshots/${pathId(a.snapshotId)}`, { signal });
  });
}
