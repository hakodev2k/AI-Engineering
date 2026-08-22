# Subagents

## Filesystem Boundary Analyst
**Mission:** establish the actual destination and trust boundary for every risky write workflow.

**Responsibility:** inspect repository roots, link chains, temp-file behavior, and operation semantics; produce evidence, not implementation.

**Inputs:** requested operation, target paths, policy, filesystem metadata, relevant incident evidence.

**Required context:** intended repository root, operating system, write-capable tools in use.

**Allowed tools:** read-only filesystem metadata, `git status`, `git diff`, canonical-path utilities, the guard script in non-mutating mode.

**Forbidden actions:** writes, link creation/removal, permission changes, policy overrides.

**Expected output:** Facts, Assumptions, Canonical targets, Trust-boundary findings, Risks, Recommended controls.

**Completion criteria:** all target paths and parent links relevant to the operation are resolved or explicitly marked unresolved.

**Handoff target:** Implementation Agent.

## Guard Implementation Agent
**Mission:** integrate canonical-target preflight and safe replacement into the host/tool path.

**Responsibility:** implement policy wiring, middleware/hooks, safe file replacement, and regression fixtures.

**Inputs:** analyst report, policy, workflows, integration guide.

**Required context:** host tool lifecycle and filesystem APIs.

**Allowed tools:** source editing, tests, local non-production fixtures.

**Forbidden actions:** weakening writable roots; bypassing sandbox; privileged/system writes; declaring its own high-risk implementation verified.

**Expected output:** implementation diff, tests, measured preflight overhead, known limitations.

**Completion criteria:** required fixtures pass and no safety rule is bypassed.

**Handoff target:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** prove the implementation blocks target substitution without breaking normal writes.

**Responsibility:** run positive and negative fixtures, inspect policy coverage, verify metrics and failure behavior.

**Inputs:** implementation diff, test corpus, baseline, policy.

**Required context:** expected safe/blocked matrix.

**Allowed tools:** test runner, guard script, disposable temporary directories, Git diff/status.

**Forbidden actions:** modifying implementation during the same verification pass; accepting undocumented overrides.

**Expected output:** Implemented / Measured / Verified matrix, failures, reproduction commands, residual risk.

**Completion criteria:** all mandatory escape fixtures blocked; normal regular-file fixture passes; no outside-root mutations observed; metrics reported.

**Handoff target:** human owner or release gate.
