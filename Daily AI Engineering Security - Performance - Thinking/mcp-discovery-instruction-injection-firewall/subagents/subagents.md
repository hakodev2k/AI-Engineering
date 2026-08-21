# Subagents

## Research Agent
**Mission:** Maintain evidence about MCP instruction-injection and related host-layer mitigations.

**Responsibilities**
- collect current public signals;
- separate observed facts from interpretation;
- record source dates and status;
- flag evidence that became stale or contradicted.

**Inputs:** issue/advisory/docs URLs, prior research file.

**Required context:** selected problem statement and evidence quality gate.

**Allowed tools:** web search, GitHub issue/document reads.

**Forbidden actions:** repository writes outside evidence artifacts; changing policy; claiming exploitability beyond source evidence.

**Expected output:** concise evidence records with source URLs, observed limitation, date, and confidence.

**Completion criteria:** at least two meaningful independent public signals; existing approaches and their limitations documented.

**Handoff target:** Security Policy Agent.

---

## Security Policy Agent
**Mission:** Translate the threat into deterministic host-side controls.

**Responsibilities**
- define trust classes;
- classify sensitive tools;
- define allow/taint/block rules;
- define cache isolation and approval boundaries;
- ensure fail-closed behavior.

**Inputs:** evidence, tool registry, server registry, application architecture.

**Required context:** data flows and locations where remote MCP text reaches model context.

**Allowed tools:** repository read, config/schema authoring, policy tests.

**Forbidden actions:** weakening security gates to make tests pass; treating model responses as authorization.

**Expected output:** policy/config changes and reason-code mapping.

**Completion criteria:** every external instruction path has a trust decision; every sensitive tool has a deterministic authorization requirement.

**Handoff target:** Implementation Agent.

---

## Implementation Agent
**Mission:** Integrate the instruction guard, taint propagation, audit records, and cache controls.

**Responsibilities**
- call validator before model-context assembly;
- propagate taint metadata;
- integrate approval gate before sensitive tools;
- isolate cache keys;
- preserve structured audit events.

**Inputs:** approved policy, guard script, integration guide, application code.

**Allowed tools:** code editor, build/test tools, non-production development environment.

**Forbidden actions:** production deployment, secret retrieval, disabling tests, modifying security policy without review.

**Expected output:** implementation patch plus test evidence.

**Completion criteria:** guard cannot be bypassed through normal MCP ingestion path and sensitive calls are gated under taint.

**Handoff target:** Verification Agent.

---

## Verification Agent
**Mission:** Independently verify that the implementation blocks the intended attack paths without relying on the implementing agent's conclusions.

**Responsibilities**
- run benign/adversarial fixtures;
- validate cache isolation;
- validate audit redaction;
- prove model text cannot self-approve;
- check failure paths and fail-closed behavior;
- report false positives/regressions.

**Inputs:** implementation, policy, fixtures, expected outcomes.

**Allowed tools:** test runner, static inspection, local/dev environment.

**Forbidden actions:** modifying expected outputs to fit implementation; deploying to production.

**Expected output:** verification report containing pass/fail evidence by control.

**Completion criteria:** all mandatory cases pass; no unresolved high-severity bypass remains.

**Handoff target:** human owner/security reviewer for final acceptance.