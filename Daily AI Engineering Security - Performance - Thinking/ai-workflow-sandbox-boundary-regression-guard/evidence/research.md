# Research — AI Workflow Sandbox Boundary Regression Guard

**Category:** Security  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Prevent regressions where user/workflow-supplied evaluator code or expressions cross from an intended sandbox into host/runtime capabilities.

## Problem
AI/workflow platforms often support custom code, expressions, evaluators, or task-runner sandboxes. Recent advisories show recurring sandbox escapes through exposed host prototypes, unsafe imports, and object/prototype resolution paths. Patching one exploit does not prove the broader boundary remains closed after future feature or dependency changes.

## Why it matters now
Multiple 2026 advisories across n8n, Flowise, and Agenta demonstrate that sandbox escapes remain a current engineering problem, with several independent root paths leading to host or runner code execution.

## Affected users
Self-hosted AI/workflow operators, platform engineers, plugin/tool authors, teams enabling custom evaluators or code nodes, and SaaS providers running multi-tenant execution workers.

## Current public evidence

### Observed evidence
1. n8n GHSA-9x83-43r8-5hwc, published August 19, 2026, describes `$fromAI` resolving caller-supplied placeholder names through inherited/reserved properties, leaking a live host prototype and reaching the `Function` constructor for code execution in the main process. Fixed versions include 1.123.73, 2.35.4 and 2.36.2 or later.  
   https://github.com/n8n-io/n8n/security/advisories/GHSA-9x83-43r8-5hwc
2. n8n GHSA-c9c6-rq46-h25v, published August 5, 2026, reports JavaScript Code node sandbox escape via prototype pollution because `Function.prototype` was not frozen.  
   https://github.com/n8n-io/n8n/security/advisories/GHSA-c9c6-rq46-h25v
3. n8n GHSA-m3hg-p5r9-fg9h, published August 5, 2026, reports task-runner escape via an unfrozen `EventEmitter` prototype, with process-wide persistence inside the shared runner.  
   https://github.com/n8n-io/n8n/security/advisories/GHSA-m3hg-p5r9-fg9h
4. Flowise CVE-2026-69253 / GHSA-wg86-r78f-74mp, published July 29 and updated August 4, 2026, reports JavaScript sandbox escape in Flowise custom function/tool execution; fixed in 3.1.3.  
   https://github.com/advisories/GHSA-wg86-r78f-74mp
5. Agenta CVE-2026-27952 / GHSA-pmgp-2m3v-34mq, published February 25, 2026, shows a Python sandbox escape where an allowed `numpy` import exposed introspection (`inspect`/`sys.modules`) and enabled arbitrary command execution; fixed in 0.48.1.  
   https://github.com/Agenta-AI/agenta/security/advisories/GHSA-pmgp-2m3v-34mq

### Interpretation
These are distinct vulnerabilities, but they share a systems root cause: the sandbox trust boundary is larger than the explicitly reviewed evaluator surface. Host prototypes, imported module graphs, shared process objects, and reserved property resolution can all become capability bridges.

## Existing approaches
- Patch known vulnerable versions.
- Freeze selected built-ins/prototypes.
- Restrict imports/modules.
- Run code workers under lower-privilege OS users or containers.
- Disable custom code/AI nodes when unnecessary.
- Restrict workflow-authoring rights to trusted users.

## Remaining limitations
- A version upgrade proves known CVEs are addressed, not that future capability exposure is absent.
- Blocklists and selective prototype freezing can miss new constructors or transitive objects.
- Allowed imports may expose dangerous introspection indirectly.
- Shared-process sandboxes can turn one tenant's prototype corruption into cross-run persistence.
- Configuration drift can re-enable unsafe modules or broad host/network access.

## Root-cause analysis
1. Capability reachability is not continuously tested as a boundary invariant.
2. Safe-object/import allowlists are reviewed syntactically rather than transitively.
3. Host and sandbox objects share prototypes or process state.
4. Worker isolation assumptions are weaker than production privilege/network/filesystem reality.
5. Security regression tests often encode the last exploit instead of generic forbidden capabilities.

## Improvement opportunity
Add a deterministic pre-release/runtime inventory guard plus non-destructive boundary sentinels. Enforce patched minimum versions for known affected platforms, deny unsafe configuration combinations, require low-privilege isolated workers for custom code, and verify that forbidden host capabilities are unreachable without executing an exploit. Keep exploit payloads out of normal CI; test invariants such as “no host process/global constructor exposure,” “no unreviewed module allowlist expansion,” and “no shared privileged worker.”

## Relevant sources
- n8n `$fromAI` sandbox escape: https://github.com/n8n-io/n8n/security/advisories/GHSA-9x83-43r8-5hwc
- n8n Code node prototype escape: https://github.com/n8n-io/n8n/security/advisories/GHSA-c9c6-rq46-h25v
- n8n EventEmitter task-runner escape: https://github.com/n8n-io/n8n/security/advisories/GHSA-m3hg-p5r9-fg9h
- Flowise sandbox escape: https://github.com/advisories/GHSA-wg86-r78f-74mp
- Agenta RestrictedPython/numpy escape: https://github.com/Agenta-AI/agenta/security/advisories/GHSA-pmgp-2m3v-34mq
