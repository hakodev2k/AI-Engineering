# Authenticated Browser Indirect Injection Boundary

Category: **Security**

## Problem
AI agents that control a real, already-authenticated browser can ingest attacker-controlled page content and then exercise the user's cookies, sessions, local browser state, and high-impact actions. Indirect prompt injection becomes materially more dangerous when browsing and authenticated action share one trust boundary.

## Evidence
See `evidence/research.md`. Current signals include the open `mcp-chrome` security issue #316, Claude Code issue #33583 on silent web access by Explore subagents, and OWASP AISVS prompt-injection guidance updated in 2026.

## Existing approach
Browser MCP servers typically expose navigation, DOM/accessibility inspection, screenshots, clicks, form filling, and JavaScript execution. Existing mitigations include manual confirmations, browser profiles, allowlists, prompt-injection warnings, and generic sandboxing.

## Existing limitations
Content read from the browser often reaches the same model context that decides the next action. Permissions may be tool-level rather than origin/session/data-sensitivity aware. A user may approve browser access once, after which malicious content can influence operations against authenticated sites. Hidden/off-screen/accessibility text can be consumed even when the user does not perceive it.

## Proposed improvement
Introduce a deterministic browser action boundary that classifies trust and consequence before execution. The package separates read-only untrusted observation from authenticated consequential actions; requires origin binding and explicit approval for sensitive writes; blocks cross-origin action chains induced by untrusted content; and logs provenance for every decision.

## Architecture
- `evidence/research.md`: source-backed problem analysis.
- `config/browser-boundary-policy.json`: default policy.
- `skills/browser-threat-model.md`: reusable threat-model procedure.
- `rules/browser-boundary.md`: enforceable controls.
- `subagents/security-verifier.md`: independent review role.
- `workflows/browse-observe-act-verify.md`: bounded operational workflow.
- `hooks/pre-browser-action.md`: blocking action gate contract.
- `scripts/browser_action_guard.py`: deterministic policy evaluator.
- `tests/test_browser_action_guard.py`: security regression tests.

## Installation
Python 3.10+, standard library only.

## Configuration
Customize trusted origins and action classes in `config/browser-boundary-policy.json`. Do not add wildcard trusted origins for authenticated sessions.

## Usage
`python scripts/browser_action_guard.py --policy config/browser-boundary-policy.json --event event.json`

The event declares source origin, target origin, authentication state, action class, whether the action was derived from untrusted content, and whether human approval is present.

## Workflow
Observe page → label provenance/trust → identify intended target and consequence → evaluate deterministic guard → request human approval if required → execute least-privilege action → verify target/result → log evidence.

## Metrics
Blocked unsafe cross-origin actions, approval coverage for sensitive writes, untrusted-content-to-write transition count, policy false-positive rate, provenance coverage, security test pass rate.

## Verification
Security verification requires adversarial fixtures proving that untrusted content cannot silently trigger authenticated sensitive actions or cross-origin consequential transitions.

## Safety
This package never treats model confidence as authorization. A prompt, web page, tool description, or retrieved instruction cannot grant additional browser capability.

## Failure handling
On missing provenance, unknown action class, policy parsing failure, or missing required approval: fail closed. Maximum automated re-evaluation retries: 1 after genuinely new evidence.

## Definition of Done
Evidence documented; trust boundaries mapped; policy installed; adversarial tests pass; consequential actions require correct approval; cross-origin injection paths are blocked; verifier signs off; no secret/session material is exposed in logs.
