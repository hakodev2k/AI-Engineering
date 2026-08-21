# Provider Boundary Subagent Routing Guard

**Category:** Security

## Problem
Privileged auxiliary model calls can inherit first-party request extensions or preferred model IDs even when the active session uses a custom/OpenAI-compatible provider. This can break approval review or silently send conversation-derived data to an unselected model.

## Evidence
See `evidence/research.md` for current reports including Codex #39532, #37009, #31870, and #37858.

## Existing approach
Provider flags, model overrides, and upstream HTTP validation exist, but capability equivalence is still sometimes inferred too broadly and failures occur after route construction.

## Proposed improvement
Validate the effective provider/model/feature route before sensitive prompt construction, require positive capability declarations for proprietary extensions, fail closed for unknown privileged routes, and independently compare final request metadata with the approved route.

## Architecture
```text
README.md
evidence/research.md
skills/effective-route-validation.md
rules/provider-boundary-rules.md
subagents/route-security-reviewer.md
workflows/validate-route-and-dispatch.md
hooks/pre-privileged-dispatch.md
scripts/route_guard.py
```

## Installation
Python 3.9+ for the deterministic guard. Integrate the hook before network dispatch for Guardian, memory, and other privileged auxiliary calls.

## Configuration
Create a provider capability policy and sanitized `route.json` / `request-metadata.json`. Capability support must be explicit; model-name matching alone is insufficient.

## Usage
`python3 scripts/route_guard.py route.json request-metadata.json`

Exit 0 = PASS, 2 = invalid evidence/configuration, 3 = boundary violation.

## Workflow
Follow `workflows/validate-route-and-dispatch.md`. One metadata refresh is allowed; known incompatibility is not retried.

## Metrics
Blocked unsafe routes, unsupported-extension failures prevented, unauthorized substitutions prevented, privileged-call success rate, and false-block rate.

## Verification
Run the route guard, inspect sanitized network metadata, and have `subagents/route-security-reviewer.md` independently verify provider/model/extensions.

## Safety
No approval failure may degrade to allow. Memory generation must defer rather than silently select a different provider/model. Logs contain no credentials or raw sensitive prompts.

## Failure handling
Detection: hook nonzero exit. Evidence: route/request diff. Retry: one metadata refresh. Fallback: native/user approval for reviewer paths where supported, defer memory generation, or explicit unsupported-route error. Escalate any unresolved mismatch.

## Implemented / Measured / Verified
Implemented = guard is integrated. Measured = route/failure metrics are collected. Verified = deterministic guard plus independent reviewer PASS and security tests confirm no unauthorized route.

## Definition of Done
Evidence documented, route contract enforced, unsupported attack/failure path blocked, permission boundaries preserved, tests pass, no secrets exposed, final request equals validated route, and no blocking issue remains.

## Customization
Extend capability policy for provider-specific extensions, but preserve positive capability checks and fail-closed behavior for privileged calls.