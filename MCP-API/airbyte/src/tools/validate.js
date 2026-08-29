const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function assertUuid(v, name) { if (v !== undefined && (typeof v !== 'string' || !UUID.test(v))) throw new Error(`${name} must be a UUID`); }
function assertPage(a) { if (a.limit !== undefined && (!Number.isInteger(a.limit) || a.limit < 1 || a.limit > 100)) throw new Error('limit must be 1..100'); if (a.offset !== undefined && (!Number.isInteger(a.offset) || a.offset < 0 || a.offset > 1000000)) throw new Error('offset must be 0..1000000'); }
export function validateToolArgs(tool, a = {}) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) throw new Error('arguments must be an object');
  for (const k of ['sourceId','destinationId','connectionId']) assertUuid(a[k], k);
  if (a.workspaceIds !== undefined) { if (!Array.isArray(a.workspaceIds) || a.workspaceIds.length > 50) throw new Error('workspaceIds must be an array with at most 50 items'); a.workspaceIds.forEach((x,i)=>assertUuid(x,`workspaceIds[${i}]`)); }
  if (a.jobId !== undefined && (!Number.isInteger(a.jobId) || a.jobId < 1)) throw new Error('jobId must be a positive integer');
  assertPage(a);
  if (['airbyte.source.get'].includes(tool) && !a.sourceId) throw new Error('sourceId is required');
  if (['airbyte.destination.get'].includes(tool) && !a.destinationId) throw new Error('destinationId is required');
  if (['airbyte.connection.get','airbyte.job.sync','airbyte.job.reset'].includes(tool) && !a.connectionId) throw new Error('connectionId is required');
  if (['airbyte.stream.list'].includes(tool) && !a.sourceId) throw new Error('sourceId is required');
  if (['airbyte.job.get','airbyte.job.cancel'].includes(tool) && !a.jobId) throw new Error('jobId is required');
  return a;
}
