# Research — Safety Classifier Context Provenance Gate

## Topic
Provenance-aware routing for AI-agent safety classifier decisions.

## Category
Security

## Problem
AI coding agents increasingly use model-based safety or prompt-injection classifiers before higher-risk tool execution. Recent reports show classifiers treating harness-injected system/plugin text, defensive-security material, or inherited context as if it were adversarial user payload. This creates operational false positives and pressure to disable the classifier entirely.

## Why it matters now
The failure is current and recurring in 2026. Claude Code issue reports describe repeated false-positive safety denials in long agent sessions, plugin-injected context being blamed as prompt injection, defensive-security code being refused, and classifier availability failures.

## Affected users
Developers using classifier-gated agent modes; security engineers reviewing prompt-injection or malware-defense code; platform builders injecting plugins/hooks/memory; multi-agent workflow owners.

## Current public evidence

### Observed evidence
1. Claude Code issue #74036 (2026-07-03) reports repeated Agent dispatch denials where a classifier cites a `context_window_protection` block injected by a SessionStart plugin rather than authored by the dispatch. Identical retries could later succeed. https://github.com/anthropics/claude-code/issues/74036
2. Claude Code issue #86207 (2026-08-12) reports 26 classifier refusals during defensive-security audit work, with most refusals occurring where no immediately preceding user message explained the alleged unsafe content. https://github.com/anthropics/claude-code/issues/86207
3. Claude Code issue #84815 (2026-08-07) reports a malware-guardrail false positive when editing legitimate first-party defensive prompt-injection detection code containing attack signatures. https://github.com/anthropics/claude-code/issues/84815
4. Claude Code issue #86940 (2026-08-15; refreshed through 2026-08-22) aggregates dozens of still-reproducing false-positive reports with request IDs. https://github.com/anthropics/claude-code/issues/86940
5. Claude Code issue #83773 (2026-08-04) reports classifier unavailability persisting across accounts, machines, operating systems, and CLI versions, showing the classifier itself is a control-plane dependency. https://github.com/anthropics/claude-code/issues/83773

### Interpretation
The reports do not prove one implementation root cause for every refusal. They do establish a practical pattern: safety gates sometimes receive context whose origin is not visible enough at the decision surface, and failures are hard to diagnose without provenance-resolved evidence.

## Existing approaches
Model-based safety classifiers, tool allow/deny lists, human approval prompts, plugin/hook configuration, and retrying failed actions.

## Remaining limitations
Origin metadata can be lost at the classifier boundary; denials can be opaque; identical retries waste latency without changing evidence; classifier outages hard-block work; allowlisting a tool does not prove specific arguments/context are safe; disabling the classifier removes a security boundary rather than fixing observability.

## Root-cause analysis
1. **Provenance collapse:** system, plugin, user, retrieval, memory, and tool-output text is flattened.
2. **Decision opacity:** denials may not map flagged spans to stable source IDs.
3. **Control coupling:** safety, permissions, and availability collapse into a boolean.
4. **Retry without new evidence:** identical inputs are retried despite no state change.
5. **Unsafe recovery pressure:** teams lack a fail-safe review path that preserves the classifier boundary.

## Improvement opportunity
Insert a deterministic provenance envelope before classification and a deterministic reconciler after the classifier. Flagged untrusted/user content remains blocked. Trusted-control-only flags route to human review, never silent allow. Classifier outage follows risk-based fail-safe policy. Unchanged retries are bounded by evidence fingerprints.

## Proposed solution
This package supplies a JSON policy, dependency-free Python provenance gate, reusable analysis skill, enforceable rules, independent Safety Reviewer contract, diagnosis and regression workflows, pre-classifier hook, and unit tests.

The design does **not** disable, weaken, or bypass a safety classifier.

## Goal
Reduce false-positive operational disruption without reducing safety coverage.

## Metrics
Classifier denials/100 gated calls; provenance-resolution rate; identical-denial retry count; manual-review rate; classifier-unavailable rate; independently reviewed false-positive rate; unsafe false-negative count; p50/p95 gate latency.

## Trigger
Before any model-based safety classifier is asked to authorize a tool action, and immediately after its decision returns.

## Inputs
Action/risk, context segments with provenance, optional classifier decision with flagged segment IDs, policy.

## Outputs
Provenance envelope; deterministic `allow`/`block`/`manual_review`; reason codes; evidence hash; audit record.

## Verification
Implemented means the gate and all package files exist. Measured means representative traces/fixtures produce metrics. Verified means tests pass, untrusted flagged content remains blocked, risky classifier outages never auto-approve, trusted-context false positives route to review, and retries are bounded.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/74036
- https://github.com/anthropics/claude-code/issues/86207
- https://github.com/anthropics/claude-code/issues/84815
- https://github.com/anthropics/claude-code/issues/86940
- https://github.com/anthropics/claude-code/issues/83773
