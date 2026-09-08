import { z } from 'zod';
import { config, maxPagesSchema, pageSizeSchema, regionSchema, uuidSchema, zoneSchema } from './config.js';
import { ScalewayClient } from './client.js';
import { enforceRisk, type Risk } from './policy.js';

const registryRegionSchema = z.enum(['fr-par','nl-ams','pl-waw']);
const approvalSchema = z.object({ approved: z.boolean().optional().default(false) });
const listOptions = z.object({ pageSize: pageSizeSchema.optional(), maxPages: maxPagesSchema });

export interface ToolDefinition {
  name: string;
  description: string;
  risk: Risk;
  inputSchema: z.ZodObject<any>;
  execute: (input: any) => Promise<unknown>;
}

export function buildTools(client: ScalewayClient): ToolDefinition[] {
  return [
    {
      name: 'scaleway.project.list',
      description: 'List Scaleway Projects visible to the configured API key within an Organization.',
      risk: 'READ',
      inputSchema: listOptions.extend({ organizationId: uuidSchema.optional() }),
      execute: async ({ organizationId, pageSize = 50, maxPages }) => {
        const id = organizationId ?? config.organizationId;
        if (!id) throw new Error('organizationId or SCW_ORGANIZATION_ID is required');
        return client.listAll(`/account/v3/projects?organization_id=${encodeURIComponent(id)}`, 'projects', pageSize, maxPages);
      }
    },
    {
      name: 'scaleway.instance.list',
      description: 'List compute Instances in one Scaleway Availability Zone; optional Project filtering is applied locally to returned metadata.',
      risk: 'READ',
      inputSchema: listOptions.extend({ zone: zoneSchema.optional(), projectId: uuidSchema.optional() }),
      execute: async ({ zone = config.defaultZone, projectId, pageSize = 50, maxPages }) => {
        const result = await client.listAll<any>(`/instance/v1/zones/${zone}/servers`, 'servers', pageSize, maxPages);
        const id = projectId ?? config.projectId;
        if (!id) return result;
        return { ...result, items: result.items.filter(server => server?.project?.id === id || server?.project_id === id) };
      }
    },
    {
      name: 'scaleway.instance.get',
      description: 'Get metadata and current state for a single Scaleway Instance.',
      risk: 'READ',
      inputSchema: z.object({ zone: zoneSchema.optional(), serverId: uuidSchema }),
      execute: ({ zone = config.defaultZone, serverId }) => client.request('GET', `/instance/v1/zones/${zone}/servers/${serverId}`)
    },
    {
      name: 'scaleway.instance.list_actions',
      description: 'List actions currently available for an Instance, such as poweron, poweroff, or reboot.',
      risk: 'READ',
      inputSchema: z.object({ zone: zoneSchema.optional(), serverId: uuidSchema }),
      execute: ({ zone = config.defaultZone, serverId }) => client.request('GET', `/instance/v1/zones/${zone}/servers/${serverId}/action`)
    },
    {
      name: 'scaleway.instance.perform_action',
      description: 'Execute a bounded Instance power action. This changes runtime state and always requires explicit human approval.',
      risk: 'HIGH_RISK',
      inputSchema: approvalSchema.extend({ zone: zoneSchema.optional(), serverId: uuidSchema, action: z.enum(['poweron','poweroff','reboot']) }),
      execute: async ({ zone = config.defaultZone, serverId, action, approved }) => {
        enforceRisk('HIGH_RISK', { approved });
        return client.request('POST', `/instance/v1/zones/${zone}/servers/${serverId}/action`, { action }, false);
      }
    },
    {
      name: 'scaleway.kubernetes.cluster.list',
      description: 'List managed Kubernetes Kapsule/Kosmos clusters in a region.',
      risk: 'READ',
      inputSchema: listOptions.extend({ region: regionSchema.optional(), projectId: uuidSchema.optional() }),
      execute: async ({ region = config.defaultRegion, projectId, pageSize = 50, maxPages }) => {
        const id = projectId ?? config.projectId;
        const suffix = id ? `?project_id=${encodeURIComponent(id)}` : '';
        return client.listAll(`/k8s/v1/regions/${region}/clusters${suffix}`, 'clusters', pageSize, maxPages);
      }
    },
    {
      name: 'scaleway.kubernetes.cluster.get',
      description: 'Get metadata, status, version, networking, and pool summary for one managed Kubernetes cluster.',
      risk: 'READ',
      inputSchema: z.object({ region: regionSchema.optional(), clusterId: uuidSchema }),
      execute: ({ region = config.defaultRegion, clusterId }) => client.request('GET', `/k8s/v1/regions/${region}/clusters/${clusterId}`)
    },
    {
      name: 'scaleway.registry.namespace.list',
      description: 'List Scaleway Container Registry namespaces in a documented Registry region.',
      risk: 'READ',
      inputSchema: listOptions.extend({ region: registryRegionSchema.optional(), projectId: uuidSchema.optional() }),
      execute: async ({ region = 'fr-par', projectId, pageSize = 50, maxPages }) => {
        const id = projectId ?? config.projectId;
        const suffix = id ? `?project_id=${encodeURIComponent(id)}` : '';
        return client.listAll(`/registry/v1/regions/${region}/namespaces${suffix}`, 'namespaces', pageSize, maxPages);
      }
    },
    {
      name: 'scaleway.registry.namespace.get',
      description: 'Get one Container Registry namespace and its visibility/status metadata.',
      risk: 'READ',
      inputSchema: z.object({ region: registryRegionSchema.optional(), namespaceId: uuidSchema }),
      execute: ({ region = 'fr-par', namespaceId }) => client.request('GET', `/registry/v1/regions/${region}/namespaces/${namespaceId}`)
    },
    {
      name: 'scaleway.registry.image.list',
      description: 'List container images, optionally filtered to one registry namespace.',
      risk: 'READ',
      inputSchema: listOptions.extend({ region: registryRegionSchema.optional(), namespaceId: uuidSchema.optional() }),
      execute: async ({ region = 'fr-par', namespaceId, pageSize = 50, maxPages }) => {
        const suffix = namespaceId ? `?namespace_id=${encodeURIComponent(namespaceId)}` : '';
        return client.listAll(`/registry/v1/regions/${region}/images${suffix}`, 'images', pageSize, maxPages);
      }
    }
  ];
}
