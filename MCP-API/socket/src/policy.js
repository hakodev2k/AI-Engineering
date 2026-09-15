export const TOOLS = Object.freeze({
  'socket.dependency.score': { upstream: 'depscore', risk: 'READ', auth: false },
  'socket.organization.list': { upstream: 'organizations', risk: 'READ', auth: true },
  'socket.alert.list': { upstream: 'alerts', risk: 'READ', auth: true },
  'socket.threat_feed.list': { upstream: 'threat_feed', risk: 'READ', auth: true },
  'socket.package.files.list': { upstream: 'package_files', risk: 'READ', auth: true },
  'socket.package.file.read': { upstream: 'package_file_contents', risk: 'READ', auth: true },
  'socket.package.file.search': { upstream: 'package_file_grep', risk: 'READ', auth: true }
});

export function assertAllowed(name, env = process.env) {
  const policy = TOOLS[name];
  if (!policy) throw new Error(`Tool not allowed: ${name}`);
  if (policy.auth && !env.SOCKET_API_TOKEN) throw new Error(`${name} requires SOCKET_API_TOKEN`);
  return policy;
}
