# Subagent Fan-out Token Budget Guard

**Category:** Token

## Problem
Subagent fan-out can multiply fixed context/tool/skill/bootstrap overhead and retry costs. Small delegated tasks may consume more tokens and allowance than serial/grouped execution, while unattended forks can repeatedly resend inherited context.

## Evidence
`evidence/research.md` documents current August 2026 signals from OpenAI Codex and Hermes Agent, including fixed per-child overhead, a 1.4M-input-token background-review failure with no result, and a reported 18.7M-token runaway session that motivated cumulative budgets.

## Existing approach
Smaller child models, prompt caching, context compaction, provider quotas, max-iteration limits, and manual fan-out discipline.

## Existing limitations
These controls do not provide per-spawn break-even analysis or a cumulative parent+child admission gate. A child can be cheap per call yet expensive in aggregate, and fixed bootstrap overhead can dominate tiny tasks.

## Proposed improvement
Measure median bootstrap tokens from recent child runs, estimate inherited context and useful work, project conservative retry cost, reserve tokens for verification, and deterministically choose `fanout`, `group`, `serial`, or `block` before spawning.

## Architecture
```text
usage history + spawn plan + session usage
        -> fanout_budget_guard.py
        -> measured bootstrap baseline
        -> conservative projected cost
        -> budget + useful-work ratio checks
        -> fanout | group | serial | block
        -> actual usage reconciliation
```

## Package tree
```text
README.md
evidence/research.md
config/budget.json
scripts/fanout_budget_guard.py
tests/test_fanout_budget_guard.py
skills/fanout-cost-analysis.md
rules/token-budget.md
subagents/token-budget-reviewer.md
workflows/measure-and-route.md
hooks/pre-spawn.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/budget.json` for session budget, reserve, child/retry limits, minimum useful-work ratio, fallback bootstrap, and projection safety factor.

## Usage
Prepare `history.json` as an array containing recent `bootstrap_tokens` measurements and `spawn-request.json` with current session usage plus proposed child tasks. Then run:
```bash
python scripts/fanout_budget_guard.py --history history.json --request spawn-request.json --policy config/budget.json
```

## Workflow
Use `workflows/measure-and-route.md`: Observe -> Measure baseline -> Diagnose duplicated overhead -> Hypothesize -> Route -> Execute -> Measure again -> independently verify. Loops are bounded.

## Metrics
- Input/output/total tokens per task.
- Bootstrap tokens per subagent.
- Useful-work-to-bootstrap ratio.
- Parent+child cumulative tokens.
- Cost/task and latency/task.
- Spawned/rejected child count.
- Result quality and regression rate.

## Verification
Run:
```bash
python -m unittest tests/test_fanout_budget_guard.py
```
Then benchmark representative serial/grouped/fan-out executions with equivalent acceptance tests. Lower token use without equivalent quality is not a verified improvement.

## Safety
The budget guard changes orchestration topology; it MUST NOT remove context required for correctness, security, or independent verification. Reserve budget is protected from ordinary fan-out.

## Failure handling
**Detection:** guard block, budget-reserve breach, excessive projection error, or quality regression.  
**Evidence:** baseline, projection, actual usage, acceptance-test results.  
**Retry policy:** at most two topology revisions; per-child retries bounded by policy.  
**Fallback:** group tiny related tasks or continue serially if correctness and reserve permit.  
**Escalation:** stop further spawns when required verification cannot fit the remaining budget.  
**Stop condition:** reserve violation, exhausted retries, or material result-quality regression.

## Definition of Done
**Implemented:** pre-spawn gate integrated and cumulative usage tracked.  
**Measured:** baseline plus actual parent/child tokens, cost, and latency collected.  
**Verified:** tests pass, representative comparison shows lower tokens/cost or justified latency benefit with equivalent quality, and independent reviewer confirms no critical context loss.

## Customization
Calibrate bootstrap history by model/tool profile and task family. Keep safety factors conservative until projection error is measured over enough runs.
