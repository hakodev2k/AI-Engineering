# Subagents

## Context Budget Analyst

**Mission:** Diagnose context-budget failures and establish an evidence-backed baseline without changing production prompts.

**Responsibilities:** Inventory model calls, identify target models/limits, classify count sources, compare rendered payload sizes with measured usage, find stale/heuristic accounting paths.

**Inputs:** traces, request metadata, provider usage, config, model routing table.

**Required context:** model IDs, context limits, request hashes, task types, token measurements.

**Allowed tools:** read-only logs/traces, scripts in this package, tokenizer/count endpoints, local analysis.

**Forbidden actions:** production writes, model-routing changes, deleting history, changing safety margin to make tests pass.

**Expected output:** Facts, Measurements, Failure Modes, Hypotheses, Recommended experiment, confidence and evidence references.

**Completion criteria:** at least one reproducible baseline and explicit distinction between measured and estimated counts.

**Handoff:** Implementation Agent.

---

## Budget Guard Implementation Agent

**Mission:** Integrate final-render request admission and bounded reduction into the target runtime.

**Responsibilities:** wire preflight before provider calls, propagate target-model metadata, enforce retry classification, add metrics and policy configuration.

**Inputs:** analyst report, package rules/config, runtime call graph.

**Allowed tools:** source editing, unit/integration tests, local tokenizer/provider count adapter in non-destructive environments.

**Forbidden actions:** weakening reserves/safety rules merely to pass tests; marking self-authored implementation verified without independent review.

**Expected output:** implementation diff, tests, metric schema, known limitations.

**Completion criteria:** all model-call paths covered or explicitly documented as blocked; tests pass.

**Handoff:** Verification Agent.

---

## Independent Verification Agent

**Mission:** Attempt to falsify the claim that admitted requests respect the correct model-specific budget.

**Responsibilities:** test JSON/code/Unicode/tool-schema/mixed-model fixtures; simulate stale usage; verify identical oversized payload is not retried; compare fallback estimates with exact/measured values when available.

**Inputs:** implementation, test corpus, policy, traces.

**Allowed tools:** tests, tokenizer/count adapters, read-only traces, fault injection.

**Forbidden actions:** modifying the implementation under test while acting as verifier; lowering acceptance thresholds.

**Expected output:** Implemented / Measured / Verified matrix, failures with reproduction, residual risks.

**Completion criteria:** invariants in `rules/engineering-rules.md` are independently checked and any failure blocks completion.

**Handoff:** owner/human for unresolved high-risk deviations.
