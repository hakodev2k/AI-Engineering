# Rules: Notebook Metadata Boundary

- Externally sourced notebook metadata MUST be treated as attacker-controlled until explicitly trusted.
- Metadata analysis MUST NOT execute notebook code, import notebook modules, or launch metadata-defined processes.
- Process, MCP, network destination, credential, secret, server, runtime, and package-management configuration MUST NOT be accepted from untrusted artifacts.
- Embedded configuration SHOULD use a positive allowlist of data-only/cosmetic sections.
- Unknown configuration sections MUST fail closed.
- Operator secrets MUST NOT be sent to artifact-defined endpoints.
- Trust elevation MUST be explicit, attributable, and logged without secret values.
- The same pre-open gate MUST run before preview/edit/import paths that can initialize runtime services.
- Security regression tests MUST include malicious metadata fixtures and future/unknown keys.
