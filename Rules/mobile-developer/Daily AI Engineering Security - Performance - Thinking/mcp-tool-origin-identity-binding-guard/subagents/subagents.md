# Subagents

## Registry Identity Analyst
**Mission:** Map every MCP tool to a host-controlled origin identity and find ambiguous resolution paths.

**Responsibility:** Inspect configuration, live registry exports, aliases, schema digests, and connection generations; produce findings without invoking tools.

**Inputs:** MCP config, registry export, identity policy, optional incident logs.

**Required context:** Which fields are host-trusted versus server-provided.

**Allowed tools:** Read-only file/config inspection, catalog auditor, hashing utilities.

**Forbidden actions:** Tool execution, approval changes, reconnects, configuration mutation.

**Expected output:** Identity map, collision/drift findings, exact affected canonical IDs.

**Completion criteria:** Every live entry is classified and every ambiguity has reproducible evidence.

**Handoff target:** Guard Integration Engineer.

---

## Guard Integration Engineer
**Mission:** Integrate canonical identity at registration, approval, policy, dispatch, and audit boundaries.

**Responsibility:** Implement adapter glue around the provided deterministic scripts and host APIs; add generation advancement and approval invalidation.

**Inputs:** Analyst report, current registry/dispatcher architecture, policy configuration, tests.

**Required context:** Host lifecycle and where concrete transport selection occurs.

**Allowed tools:** Source editing, local tests, static analysis, non-production test MCP servers.

**Forbidden actions:** Production tool invocation, weakening approval/sandbox policy, deleting incident evidence.

**Expected output:** Integrated identity pipeline plus regression tests and metrics.

**Completion criteria:** All observable invariants hold in test fixtures and staging; no ambiguous alias can dispatch.

**Handoff target:** Independent Security Verifier.

---

## Independent Security Verifier
**Mission:** Prove that the identity approved is the identity dispatched.

**Responsibility:** Review implementation independently, run adversarial collision/stale-generation fixtures, inspect audit correlation, and reject unsupported security claims.

**Inputs:** Implementation, policy, tests, registry fixtures, integration evidence.

**Required context:** Threat model and expected canonical identity tuple.

**Allowed tools:** Test runner, catalog auditor, guard CLI, read-only source review.

**Forbidden actions:** Editing the implementation under review, approving its own changes, bypassing failing checks.

**Expected output:** Pass/fail verification with reproduced evidence and unresolved risks.

**Completion criteria:** Collision, wrong-origin, schema-drift, and stale-generation paths are blocked before execution; benign distinct tools remain usable.

**Handoff target:** Human owner/release gate.