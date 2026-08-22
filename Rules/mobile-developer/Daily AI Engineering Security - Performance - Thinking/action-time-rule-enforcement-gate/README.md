# Action-Time Rule Enforcement Gate

## Topic
Turn critical procedural instructions into observable checks immediately before governed actions.

## Category
Thinking

## Problem
Project instructions and persistent memory can be loaded and understood yet skipped during long, tool-heavy execution. Declarative context alone does not prove that a required precondition was checked at the action boundary.

## Evidence
See `evidence/research.md`. Public signals include Claude Code issues #84265, #80579, and #81988.

## Existing approach
Session-start CLAUDE.md loading, persistent memory, stronger imperative wording, model self-review, and generic hooks.

## Existing limitations
Critical rules and preferences share the same context; evidence freshness is implicit; long sessions dilute procedural relevance; user correction occurs after cost or mutation.

## Proposed improvement
Compile only hard procedural invariants into a compact gate registry. Before a matched action, validate fresh observable evidence. Missing/stale evidence blocks; non-deterministic rules route to review. The gate never requests hidden chain-of-thought.

## Architecture
- `evidence/research.md` — current evidence, interpretation, root causes, metrics.
- `rules/action-gates.md` — enforceable gate requirements.
- `skills/rule-to-gate-compiler.md` — procedure for converting rules into observable invariants.
- `subagents/gate-verifier.md` — independent replay/review role.
- `workflows/enforce-at-action-boundary.md` — bounded improvement flow.
- `hooks/pre-governed-action.md` — deterministic pre-action hook contract.
- `config/gates.example.json` — example registry.
- `scripts/check_action_gates.py` — dependency-free gate evaluator.
- `tests/test_gate_cases.py` — fresh/missing/stale/epoch/review boundary tests.

## Installation
Python 3.9+ only; no third-party packages.

## Configuration
Each registry gate defines `id`, `actions`, `required_evidence`, and `on_failure`. Evidence requirements may define `equals`, `max_age_seconds`, and `same_epoch`.

Example evidence record:
```json
{
  "records": {
    "build_passed": {
      "value": true,
      "observed_at": "2026-08-19T15:00:00+00:00",
      "epoch": "git-sha-or-worktree-version"
    }
  }
}
```

An epoch should change when an event invalidates the evidence, such as source/config/branch changes.

## Usage
`python3 scripts/check_action_gates.py --registry config/gates.example.json --action action.json --evidence evidence.json`

Exit codes:
- `0`: allow;
- `2`: hard block;
- `3`: review required or invalid deterministic input;
- `4`: unexpected checker failure.

Run tests:
`python3 -m unittest tests/test_gate_cases.py`

## Workflow
Observe incidents → measure baseline → classify hard rule → define observable evidence and invalidation → compile gate → replay failure → measure valid path/false blocks → independent verification.

## Metrics
Governed-action coverage, escaped hard-rule violations, stale-evidence catches, false-positive blocks, added latency, added context/tokens, and rework/invalid-run rate.

## Verification
**Implemented** means the registry/checker/hook artifacts are integrated. **Measured** means baseline and post-adoption telemetry exist. **Verified** means historical violations are blocked, valid fresh-evidence cases pass, false blocks are acceptable, retries are bounded, and the independent verifier returns `VERIFIED`.

## Safety
The package does not weaken host permissions or approval requirements. It does not treat instruction rereading as proof that operational preconditions were satisfied. It never asks for hidden reasoning; evidence must be observable.

## Failure handling
Detection: block/review decision, escaped replay, stale evidence, or excessive false blocks.
Evidence: gate ID, action type, evidence key, timestamp/epoch, checker result.
Retry: maximum 2 gate-definition cycles with new evidence or a materially changed matcher/contract.
Fallback: explicit human review while preserving the original hard rule.
Escalation: harness owner/project rule maintainer.
Stop: unsafe bypass, evidence forgery path, or unbounded/subjective gate behavior.

## Definition of Done
Current evidence documented; hard rule classified; baseline captured; observable evidence defined; invalidation modeled; checker integrated; historical failure blocked; fresh valid case allowed; no hidden chain-of-thought requested; metrics collected; independent verification complete.

## Customization
Add domain-specific action types and evidence producers, but keep the registry limited to rules whose violation has meaningful correctness, cost, reliability, or safety impact. Preferences should remain non-blocking.
