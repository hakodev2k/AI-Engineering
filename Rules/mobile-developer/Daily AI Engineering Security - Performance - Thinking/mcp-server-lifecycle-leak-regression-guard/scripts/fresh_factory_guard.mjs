// Fail-fast wrapper for stateless MCP server factories.
// It detects accidental object reuse without depending on a specific MCP SDK class.
export function requireFreshFactory(factory) {
  if (typeof factory !== 'function') throw new TypeError('factory must be a function');
  const seen = new WeakSet();
  let calls = 0;
  return (...args) => {
    const server = factory(...args);
    calls += 1;
    if ((typeof server !== 'object' && typeof server !== 'function') || server === null) {
      throw new TypeError(`factory call ${calls} did not return an object`);
    }
    if (seen.has(server)) {
      throw new Error(`stateless MCP factory reused a server instance on call ${calls}; return a fresh protocol-bearing server and share only safe dependencies outside the factory`);
    }
    seen.add(server);
    return server;
  };
}

// Example:
// const guardedFactory = requireFreshFactory(({ authInfo }) => buildServer({ authInfo, dbPool }));
// const handler = createMcpHandler(guardedFactory);
