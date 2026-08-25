# Agent Version Resume Cache Boundary Guard

**Category:** Token

## Problem
A paused long-context agent can resume under a different binary/model/effort/tool/hook/system configuration and silently reconstruct a different prompt prefix. Public August 2026 reports show this can convert a warm session into a one-turn cache rewrite of hundreds of thousands of tokens.

## Evidence and limitations of current approaches
See `evidence/research.md`. Provider caching and generic regression alarms help, but they usually detect cost after the resume call and do not explain which boundary component drifted.

## Proposed improvement
Treat the cache-relevant prefix identity as a versioned checkpoint contract. Compare privacy-safe fingerprints before resume; distinguish structural drift from TTL expiry; measure the first resumed turn; verify that optimization does not delete required context.

## Architecture
```
README.md
evidence/research.md
scripts/cache_boundary.py
tests/test_cache_boundary.py
rules/cache-boundary-rules.md
skills/resume-boundary-analysis.md
subagents/cache-boundary-verifier.md
workflows/diagnose-optimize-verify.md
hooks/pre-resume-cache-boundary.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Create checkpoint/current JSON manifests containing: `runtime_version`, `model`, `effort`, `system_prompt_hash`, `tool_schema_hash`, `hook_context_hash`, `policy_hash`. Hash values must be produced from the actual effective components by the host; never place secrets or raw prompts in manifests.

## Usage
`python3 scripts/cache_boundary.py checkpoint.json current.json --json`

Run tests with `python3 -m unittest tests/test_cache_boundary.py`.

## Workflow
Follow `workflows/diagnose-optimize-verify.md`. The pre-resume integration contract is `hooks/pre-resume-cache-boundary.md`.

## Metrics
First-resume cache creation tokens, cache-read ratio, avoidable rewrite tokens, resume latency, drift causes/session, regression rate.

## Verification
**Implemented:** boundary manifest generation/comparison integrated. **Measured:** comparable before/after resume metrics captured. **Verified:** independent verifier confirms reduced avoidable rewriting with required context hashes/policies preserved and tests passing.

## Safety
This package must never remove security rules, tool definitions, or task context merely to keep a prefix stable. Hash manifests must not contain raw sensitive content.

## Failure handling
Detection: nonzero script exit or cold-resume metric. Evidence: manifests plus usage. Maximum retries: two controlled iterations. Fallback: explicit cold start. Escalation: runtime/provider owner. Stop when structural fingerprint is identical but provider behavior remains cold.

## Definition of Done
Evidence documented; baseline captured; drift cause identified or explicitly unresolved; tests pass; before/after measured; required context preserved; independent verification complete; no blocking issue remains.
