# Subagents

## Performance Investigator

**Mission:** Determine whether repository scanning is the dominant latency/resource bottleneck.

**Responsibilities:** collect traces; separate scan overhead from tool execution; identify scanner/process source; rank amplification paths; produce a scoped hypothesis.

**Inputs:** host logs, process telemetry, repository/worktree metadata, scan events.

**Required context:** active/inactive project state, repository size, worktree lifecycle, sandbox mode, dependency/generated directories.

**Allowed tools:** read-only process inspection, logs, Git/ripgrep tracing, `scan_guard.py`.

**Forbidden actions:** changing ignore policies or disabling scanners during baseline collection; destructive repository operations.

**Expected output:** baseline report with evidence, dominant source, confidence, and next experiment.

**Completion criteria:** at least one reproducible amplification path or a justified conclusion that scanning is not material.

**Handoff:** Host Optimization Agent.

## Host Optimization Agent

**Mission:** Implement bounded scan deduplication, scope reduction, or invalidation improvements.

**Responsibilities:** add scan identity; cooldown/cache where safe; event-driven invalidation; concurrency/rate limits; telemetry; preserve correctness.

**Inputs:** investigator report, policy, host integration points, correctness fixtures.

**Required context:** lifecycle events and what file state each downstream consumer requires.

**Allowed tools:** source editing, local tests, benchmark harness.

**Forbidden actions:** silently increasing thresholds, permanently caching inventories, disabling security/sandbox boundaries for speed.

**Expected output:** implementation plus changed configuration and benchmark artifacts.

**Completion criteria:** measurable scan reduction with no fixture correctness regression.

**Handoff:** Independent Verification Agent.

## Independent Verification Agent

**Mission:** Verify performance claims and discovery correctness independently of the implementer.

**Responsibilities:** replay benchmark scenarios; run guard; inspect file-discovery fixtures; compare baseline and candidate; classify Implemented/Measured/Verified.

**Inputs:** baseline traces, candidate traces, policy, tests, implementation diff.

**Required context:** target thresholds and accepted variance.

**Allowed tools:** read-only diff inspection, test runner, benchmark runner, `scan_guard.py`.

**Forbidden actions:** modifying implementation while acting as verifier; weakening policy to obtain a pass.

**Expected output:** verification verdict, metrics comparison, remaining risks.

**Completion criteria:** all required scenarios executed and verdict supported by observable outputs.

**Handoff:** Orchestrator/human owner.

## Orchestrator

**Mission:** Enforce bounded Observe → Optimize → Verify loops.

**Responsibilities:** assign roles; maintain baseline; allow at most 3 optimization iterations; stop on correctness regression or unavailable upstream control; require explicit approval for policy exceptions.

**Forbidden actions:** unlimited retries; allowing implementing agent to be sole final verifier; reporting success from subjective observation.

**Expected output:** completed package rollout or explicit blocked/escalated state.