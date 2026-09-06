# GUI Agent Conflict Feasibility Gate

**Category:** Thinking

## Problem
GUI agents can recognize that a requested goal is infeasible or inconsistent with the current interface and still execute a nearby action. This awareness-action mismatch creates execution-biased overcompliance: the agent keeps acting because an action is available, not because that action satisfies the user's exact constraints.

## Evidence
`evidence/research.md` documents current evidence. The strongest signal is Huang et al.'s CONFLICTGUI/CONFLICTGUARD work submitted on 2026-09-03, which evaluates instruction-internal and instruction-GUI conflicts across multiple GUI agents and reports severe overcompliance. Ruflo issue #3191, opened 2026-09-05, independently identifies the orchestration need for a conflict-aware feasibility gate while explicitly noting that its reproduction is still pending. HiSA in Findings of ACL 2026 also treats `infeasible` as a first-class termination action.

## Existing approach
Current approaches include feasibility prompting, inference-time action modulation, explicit `infeasible` actions, tool-argument validation, and human approval for risky operations.

## Existing limitations
A prompted self-check is still advisory if the same model can ignore it while generating the next action. Tool validation sees whether an action is syntactically valid, not whether it satisfies the user's exact goal. A bare termination token does not define evidence requirements or preserve unresolved conflicts across long-horizon steps, retries, subagents, or resumed sessions.

## Proposed improvement
Move feasibility into explicit orchestration state. Before consequential actions, the runtime evaluates a structured envelope containing exact constraints, fresh observations, unresolved conflicts, evidence completeness, deviation policy, and action reversibility. A deterministic gate returns `PROCEED`, `STOP`, or `ESCALATE`; the acting model cannot override blocking outcomes.

## Architecture
- `skills/verify-feasibility-before-action.md` — evidence-driven feasibility procedure.
- `rules/conflict-aware-action-rules.md` — enforceable conflict and stop-condition rules.
- `subagents/feasibility-verifier.md` — independent verification role.
- `workflows/observe-verify-act.md` — bounded Observe → Verify → Act loop.
- `hooks/pre-action-feasibility.md` — blocking pre-action hook contract.
- `scripts/feasibility_gate.py` — dependency-free deterministic decision gate.
- `tests/test_feasibility_gate.py` — feasible, blocking, escalation, and conflict-persistence regression tests.
- `evidence/research.md` — current evidence, existing approaches, limitations, and root causes.

## Package tree
```text
gui-agent-conflict-feasibility-gate/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-action-feasibility.md
├── rules/
│   └── conflict-aware-action-rules.md
├── scripts/
│   └── feasibility_gate.py
├── skills/
│   └── verify-feasibility-before-action.md
├── subagents/
│   └── feasibility-verifier.md
├── tests/
│   └── test_feasibility_gate.py
└── workflows/
    └── observe-verify-act.md
```

## Installation
Requires Python 3.10+ and no third-party dependencies. Integrate the hook before the runtime's consequential GUI action dispatch point.

## Configuration
Create a JSON feasibility envelope containing:
- `goal`: exact user goal.
- `constraints`: objects with `id`, `required`, `state` (`satisfied`, `unsatisfied`, `unknown`) and observable `evidence`.
- `conflicts`: objects with `id`, `severity` (`blocking`, `advisory`), `status` (`open`, `resolved`) and observable `evidence`.
- `previous_open_conflict_ids`: conflict IDs that were unresolved at the previous checkpoint.
- `evidence_complete`: whether all correctness-critical state needed for this action is known.
- `proposed_action`: `name`, `consequential`, `irreversible`, `is_deviation`, and `deviation_allowed`.

Do not place hidden chain-of-thought in the envelope. Facts, constraints, conflicts and evidence are sufficient.

## Usage
Run:

```bash
python3 scripts/feasibility_gate.py feasibility.json
```

Decision/exit mapping:
- `PROCEED` → 0
- invalid input → 1
- `STOP` → 2
- `ESCALATE` → 3

Run regression tests:

```bash
python3 -m unittest tests/test_feasibility_gate.py
```

## Workflow
Follow `workflows/observe-verify-act.md`: fresh observation → normalize facts/constraints/conflicts → deterministic gate → execute only on PROCEED → re-observe postcondition → bounded recovery → independent verification. Evidence-refresh retries are capped at two unless a human explicitly authorizes further investigation.

## Metrics
- Consequential actions executed while a blocking conflict is open: **0**.
- Unresolved conflicts lost across retries/handoffs/resume: **0**.
- Conflict cases correctly stopped or escalated: **100%** on the maintained local regression set.
- Feasible-task success rate: no unacceptable regression from the pre-integration baseline.
- False-stop rate: below the team's explicitly chosen acceptance threshold.
- Evidence-refresh attempts for one unresolved state: **<=2** without human authorization.

## Verification
**Implemented** means the envelope, gate and enforcement hook are wired into the runtime. **Measured** means conflict and feasible-control cases have been executed with recorded outcomes. **Verified** means an independent verifier confirms that STOP/ESCALATE decisions really prevent consequential dispatch and that feasible-task performance remains within the accepted regression threshold.

A model merely stating that it would stop is not verification.

## Safety
Do not weaken user constraints to make progress. Do not choose a closest available option without explicit deviation permission. Do not execute destructive or externally visible actions to gather evidence. Require human approval for irreversible actions when feasibility remains unresolved. Do not expose hidden chain-of-thought.

## Failure handling
Detection includes STOP/ESCALATE, invalid envelope, stale or incomplete evidence, postcondition mismatch, dropped conflict state, or independent verifier failure. Preserve structured evidence. Refresh evidence at most twice; each retry must add new information. If unresolved, stop the mutation path and escalate. Never convert an unresolved conflict to success by changing acceptance criteria.

## Definition of Done
- Current evidence and existing limitations documented.
- Baseline conflict and feasible-control metrics captured.
- Exact task constraints represented explicitly.
- Fresh observations are required for consequential actions.
- Unresolved conflicts persist across execution boundaries.
- Deterministic gate is integrated and blocks prohibited action dispatch.
- Regression tests pass in the target environment.
- Feasible-task success remains within accepted regression threshold.
- Independent verification completes.
- No blocking conflict or unexplained state loss remains.

## Customization
Extend consequence classes and organizational approval policy at the host layer. Preserve three invariants: known blocking conflicts stop execution, incomplete correctness-critical evidence cannot authorize consequential actions, and previously open conflicts cannot silently disappear.
