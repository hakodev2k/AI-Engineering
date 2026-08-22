# Evidence-Gain Convergence Controller

**Category:** Thinking

## Problem
Long-running coding agents can spend hours and large token budgets on planning, validation, review, delegation, and narration without materially reducing uncertainty or advancing the user's terminal objective. Activity becomes a poor proxy for progress.

## Evidence
See `evidence/research.md`. Recent public reports describe >5-hour non-convergent tasks with zero original bugs fixed, recursive multi-agent review/test expansion, and self-reinforcing verification/governance machinery.

## Existing approach
Plan/execute/review loops, max-iteration limits, user stop conditions, human interruption, and completion gates.

## Existing limitations
Fixed limits do not measure usefulness; end-of-run completion checks do not prevent long low-gain loops; agent-created uncertainty can expand faster than it is resolved; recursive reviewers can amplify the loop; and status text may drift from actual tool state.

## Proposed improvement
Track a machine-readable terminal state plus an action ledger. Every expensive action must target a named uncertainty/criterion, predict decisive outcomes, and record expected/actual evidence gain. Two similar zero-gain actions force strategy change; a third is blocked. Settled decisions require contradictory evidence to reopen. Status transitions must be tool-state-backed.

## Architecture
- `skills/evidence-gain-analysis.md` — evidence-driven convergence procedure.
- `rules/convergence-rules.md` — observable loop/decision/status constraints.
- `subagents/convergence-verifier.md` — independent verifier.
- `workflows/converge-on-terminal-objective.md` — bounded terminal-state workflow.
- `hooks/pre-action-convergence.md` — blocks repeated low-gain actions.
- `scripts/action_ledger_check.py` — deterministic ledger validation.
- `schemas/action-ledger.schema.json` — portable ledger contract.
- `tests/test_action_ledger_check.py` — boundary tests.

## Actual package tree
```text
README.md
evidence/research.md
hooks/pre-action-convergence.md
rules/convergence-rules.md
schemas/action-ledger.schema.json
scripts/action_ledger_check.py
skills/evidence-gain-analysis.md
subagents/convergence-verifier.md
tests/test_action_ledger_check.py
workflows/converge-on-terminal-objective.md
```

## Installation
Requires Python 3.9+ for the deterministic checker. Integrate the action ledger into the agent orchestrator, hook runner, or repository-local workflow. JSON Schema validation is optional; the included Python checker has no third-party dependency.

## Configuration
Define the terminal phases relevant to the workflow, the task's rough time/token scale, which actions count as expensive, and high-risk verification that is mandatory regardless of gain score. Default policy: two consecutive zero-gain actions for the same uncertainty/signature require strategy change; a third similar action is blocked.

## Usage
Create `action-ledger.json` following `schemas/action-ledger.schema.json`, then run:

`python3 scripts/action_ledger_check.py action-ledger.json`

Exit 0 means no deterministic convergence violation; exit 2 means invalid input; exit 3 means a convergence rule was violated.

## Workflow
Follow `workflows/converge-on-terminal-objective.md`: reconstruct terminal state → measure baseline → select one blocker → record expected evidence gain → execute → score actual gain → change strategy on low-gain streak → independently verify phase transitions → finish or emit a precise blocker.

## Metrics
Evidence gain/tool call, evidence gain/1K tokens, duplicate action rate, longest zero-gain streak, reopened settled decisions, review/delegation rounds, phase transitions/hour, tokens per verified phase, rework count, and unsupported status claims.

## Verification
Run `python3 tests/test_action_ledger_check.py`. For a production trace, sample action records against real tool/test/deployment evidence. Confirm no forbidden third zero-gain repeat, no unsupported decision reopen, and no status transition unsupported by observable state.

## Safety
Evidence-gain optimization never permits skipping required security, correctness, legal, or approval checks. High-risk independent verification may be mandatory even if it resembles prior validation, but its distinct trust purpose must be recorded. Never request or store hidden chain-of-thought; only observable state is required.

## Failure handling
Detection: checker violation, low-gain streak, or verifier BLOCK. Evidence: action ledger and tool-state references. Retry: at most two strategy revisions per uncertainty and two review rounds for unchanged artifacts unless new evidence appears. Fallback: stop recursive review/delegation and return to the decisive path. Escalation: precise blocker or required human approval. Stop when no available action has expected gain >=1.

## Implemented / Measured / Verified
**Implemented** means the ledger/controller is integrated. **Measured** means evidence-gain and duplicate/rework metrics were captured on a representative task. **Verified** means independent review confirms observable-state consistency and bounded loops. Do not merge these states.

## Definition of Done
Evidence documented; terminal objective represented; action ledger complete; low-gain retry bounds enforced; settled decisions preserved unless contradicted; status claims tied to tool state; relevant task acceptance checks pass; metrics captured; independent verifier PASS or one precise external blocker remains; no required safety/approval check was weakened.

## Customization
Extend action signatures for shell/test/browser/MCP/delegation operations, add token/time telemetry, connect phase state to CI/deployment APIs, and add semantic duplicate detection. Preserve the core rule that repeated activity without evidence gain forces strategy change rather than more of the same.

## Schema example

`examples/action-ledger.example.json` is a synthetic instance of `schemas/action-ledger.schema.json` for contract smoke tests. It contains no production data and demonstrates shape only; validate it with the package's documented checker or a Draft 2020-12 JSON Schema validator before adapting it.
