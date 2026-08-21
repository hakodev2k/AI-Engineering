# Subagents

## Performance Investigator
**Mission:** establish a reproducible baseline and isolate where workspace-scan time is spent.

**Responsibilities:** run bounded probes; separate Git/untracked, filesystem, sandbox/runtime, WSL boundary, and concurrency hypotheses; produce ranked evidence.

**Inputs:** workspace, agent/runtime version, OS, representative slow action, policy.

**Required context:** Git repository state, generated directories, sandbox mode, WSL placement, concurrent tasks.

**Allowed tools:** read-only shell commands, measurement scripts, Git status/config inspection, OS performance tracing.

**Forbidden actions:** changing sandbox mode, deleting caches, changing Git config, editing ignore files, moving repositories.

**Expected output:** baseline artifact, hotspot ranking, hypothesis list with evidence.

**Completion criteria:** at least one repeatable baseline and a bounded root-cause hypothesis, or an explicit statement that evidence is insufficient.

**Handoff:** Implementation Agent.

---

## Implementation Agent
**Mission:** apply the smallest reversible mitigation supported by evidence.

**Responsibilities:** implement approved ignore/exclude, cache, placement, or runtime coordination change; document rollback; preserve security.

**Inputs:** Performance Investigator report, policy, repository constraints.

**Allowed tools:** repository-local edits, approved local Git config, runtime configuration under project ownership.

**Forbidden actions:** disabling sandbox/security, global config without approval, destructive cleanup of unknown paths, broad unrelated refactors.

**Expected output:** exact change set, rollback instructions, post-change measurement request.

**Completion criteria:** one scoped mitigation applied and ready for independent measurement.

**Handoff:** Verification Agent.

---

## Verification Agent
**Mission:** independently determine whether the mitigation improved performance without correctness/security regression.

**Responsibilities:** rerun identical probes; run guard against baseline; verify new/untracked files required by the workflow remain visible; confirm security controls remain unchanged.

**Inputs:** baseline, post-change measurement, change set, policy.

**Allowed tools:** measurement/guard scripts, Git inspection, tests, read-only OS metrics.

**Forbidden actions:** changing the mitigation being verified; weakening thresholds to make a result pass.

**Expected output:** Implemented / Measured / Verified status with before/after metrics and any remaining risk.

**Completion criteria:** guard result plus correctness/security verification.

**Handoff:** workflow owner or Performance Investigator if the hypothesis failed.

---

## Optional Runtime Architect
**Mission:** design durable scan deduplication/caching when the bottleneck is inside an agent platform rather than repository configuration.

**Responsibilities:** define cache key, invalidation events, workspace identity, concurrency lock/single-flight behavior, instrumentation, and fallback.

**Allowed tools:** architecture/design artifacts, runtime code owned by the project.

**Forbidden actions:** cache reuse across unrelated workspaces/tenants without explicit isolation guarantees.

**Completion criteria:** design includes invalidation, bounded stale window, metrics, failure path, and security review.

**Handoff:** Implementation Agent, then Verification Agent.