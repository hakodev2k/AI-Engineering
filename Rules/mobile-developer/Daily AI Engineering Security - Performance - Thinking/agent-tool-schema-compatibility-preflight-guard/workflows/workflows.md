# Workflows

## Workflow A — Discovery-to-Provider Preflight

### Trigger
Tool discovery completes, an MCP server reconnects, provider/model changes, or any enabled tool schema fingerprint changes.

### Goal
Construct a provider-compatible manifest without sending known-incompatible schemas to the provider.

### Inputs
Tool inventory, original schemas, provider profile, validation cache.

### Baseline
Before rollout capture: provider invalid-schema error rate, average failed turns caused by schemas, repeated identical failures, tool count, and request latency.

### Context
Provider/model, MCP/framework version, profile version, tool origin, schema fingerprint.

### Stages
1. **Observe** — Compatibility Investigator captures all discovered schemas and fingerprints.
2. **Profile** — select one explicit provider profile; unknown profile blocks.
3. **Validate** — run `schema_preflight.py` per manifest/tool.
4. **Classify** — compatible, quarantine-safe, or blocking incompatibility.
5. **Plan** — expose only tools with current compatible verdicts; synchronize planner-visible tool list.
6. **Execute** — submit provider request only after coverage reaches 100% for enabled tools.
7. **Measure** — record local validation latency and downstream schema failures.
8. **Verify** — Independent Verification Agent checks no incompatible fingerprint was submitted.

### Responsible agents
Compatibility Investigator → Guard Implementation Agent for new rule defects → Independent Verification Agent.

### Tools
`schema_preflight.py`, provider profiles, host metrics, fixture suite.

### Outputs
Compatibility report, quarantined tool set, validated manifest fingerprint, metrics.

### Checkpoints
- CP1: original schemas preserved.
- CP2: profile resolved.
- CP3: 100% tool coverage.
- CP4: planner-visible and provider-visible tools match quarantine disposition.
- CP5: no unchanged invalid fingerprint sent downstream.

### Metrics
Coverage, validation p95, local incompatibility count, provider schema error rate, duplicate-invalid attempts.

### Retry policy
No retry for unchanged incompatible schema. One reload/re-discovery is allowed if schema drift is suspected. A second identical result stops the workflow.

### Stop conditions
Stop successfully when all enabled tools pass or are safely quarantined. Stop as blocked if a required tool is incompatible or the profile is unknown.

### Failure path
Capture sanitized provider error and schema fingerprint; do not retry; route to Compatibility Investigator; add a regression fixture before changing profile behavior.

### Verification
Compare downstream error rate to baseline and ensure fixture suite passes.

### Definition of Done
100% coverage, no blocking incompatibility, no duplicate deterministic retries, metrics captured, independent verification complete.

---

## Workflow B — Deferred/Generic Tool Runtime Contract Gate

### Trigger
A model returns a generic bridge call such as `tool_call(name, arguments)` or another path where concrete provider-native schema validation was not applied.

### Goal
Prevent malformed arguments from reaching the MCP/tool server.

### Inputs
Tool name, arguments, current validated schema fingerprint.

### Baseline
Track pre-rollout server-side missing-argument/type/enum failures and correction retries.

### Stages
1. Resolve the named tool and current schema.
2. Verify fingerprint matches the preflighted version; on mismatch reload once and return to Workflow A.
3. Validate required keys, unknown keys when closed, simple types, and enums.
4. If valid, dispatch exactly once.
5. If invalid, return structured rule/path evidence to the orchestrator.
6. Allow one model correction attempt for argument-only errors.
7. Revalidate corrected arguments.
8. Dispatch only if the second validation passes; otherwise stop.

### Checkpoints
No dispatch before validation; no correction retry for schema incompatibility; no side-effect replay after uncertain dispatch outcome.

### Metrics
Pre-dispatch rejection rate, correction success, server validation errors, retries avoided.

### Retry policy
Maximum one argument correction. Maximum one schema refresh for fingerprint mismatch.

### Stop conditions
Valid dispatch completes, or retry budget exhausted.

### Failure path
Return concise structured error and disable this call path for the current turn if correctness cannot be established.

### Verification
Known malformed argument fixtures are rejected before dispatch; compatible arguments pass unchanged.

### Definition of Done
No malformed fixture reaches dispatch and bounded retry behavior is proven.

---

## Workflow C — Provider Rejection Learning Loop

### Trigger
Provider returns an invalid tool/function schema error even though local preflight passed.

### Goal
Improve the compatibility profile without speculative broadening or weakening.

### Stages
1. Freeze the failing fingerprint and provider/profile versions.
2. Sanitize and record exact provider error/path.
3. Reproduce locally where possible.
4. Form one hypothesis about unsupported construct.
5. Add a failing regression fixture.
6. Implement the smallest profile/linter change.
7. Run full fixture suite.
8. Independent Verification Agent reviews semantic impact.
9. Roll out profile version and measure recurrence.

### Retry policy
At most two hypothesis iterations. If neither produces reproducible evidence, stop and escalate rather than guessing.

### Definition of Done
New provider rule is evidence-backed, regression-tested, versioned, and independently verified.
