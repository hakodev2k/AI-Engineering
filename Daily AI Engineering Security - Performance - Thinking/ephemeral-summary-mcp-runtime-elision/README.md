# Ephemeral Summary MCP Runtime Elision
**Category:** Performance

## Problem
Tool-free internal/ephemeral AI tasks such as thread summaries can inherit global MCP configuration, eagerly start tool runtimes they never use, and retain those runtimes when completion only unsubscribes instead of disposing the session.

## Evidence
See `evidence/research.md` for current August 2026 evidence and source links.

## Existing approach
Current mitigations include lazy MCP startup, per-session teardown, explicit thread removal, shared MCP pools, restarts and disabling heavy global servers.

## Existing limitations
Lazy startup is ineffective when generic session construction still inherits MCP; unsubscribe is not resource disposal; shared pools still waste resources for tasks that require no tools.

## Proposed improvement
Add an explicit resource-intent contract: tool-free ephemeral sessions receive zero effective MCP servers, and one-shot completion must remove/shutdown owned runtime rather than unsubscribe only.

## Actual package tree
```
README.md
config/policy.json
evidence/research.md
hooks/pre-ephemeral-session.md
rules/resource-intent.md
scripts/runtime_intent_guard.py
skills/ephemeral-runtime-analysis.md
subagents/performance-verifier.md
tests/test_runtime_intent_guard.py
workflows/measure-and-remediate.md
workflows/regression-verification.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/runtime_intent_guard.py --event event.json --policy config/policy.json`

## Metrics
MCP processes per tool-free summary; retained ephemeral sessions; RSS delta after N summaries; summary p50/p95 latency; cleanup latency; output-quality regression rate.

## Verification
Run `python -m unittest tests/test_runtime_intent_guard.py`, then execute the before/after benchmark in `workflows/regression-verification.md`.

## Safety
Do not remove MCP from sessions that genuinely require tools. Do not dispose while tool calls are pending. Resource reduction must not weaken required context, permissions or correctness.

## Failure handling
Maximum two remediation iterations. If ownership remains ambiguous, disable the optimization and retain correctness while collecting ownership telemetry.

## Definition of Done
**Implemented:** resource intent is enforced at admission and completion.  
**Measured:** process/RSS/latency baseline and after-state captured.  
**Verified:** tool-free ephemeral MCP count returns to zero, no retained one-shot sessions, tests pass, and summary quality is non-regressed.
