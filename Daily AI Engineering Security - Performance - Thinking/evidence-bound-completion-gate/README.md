# Evidence-Bound Completion Gate

**Category:** Thinking

## Problem
Coding agents can confidently report completion using stale, partial, noncanonical, or absent verification evidence. Conversely, simplistic wrappers may rerun expensive full suites after every edit. Both failure modes create rework, cost, and unreliable automation.

## Evidence
See `evidence/research.md`. Recent 2026 reports document false-green “verified” claims, unsupported status assertions, repeated costly test runs, headless verification-loop gaps, and verification bypasses.

## Existing approach
Instruction files, pre-commit hooks, CI, reviewer agents, stop hooks, and wrapper loops are useful. Their remaining weakness is that completion is often still prose rather than a machine-checkable transition tied to fresh current-tree evidence.

## Proposed improvement
Use a repository-owned verification contract, evidence records tied to the current tree, proportional check selection, bounded fix/verify attempts, and an independent deterministic completion gate.

## Architecture
`config/verification-contract.json` defines checks and risk mapping. The Skill creates the plan. Rules constrain claims and bypasses. The implementation workflow uses focused checks during iteration and required final checks. The Independent Verifier validates evidence. The pre-completion hook runs the deterministic validator.

## Package tree
```text
README.md
evidence/research.md
config/verification-contract.json
skills/verification-contract-design.md
rules/completion-claims.md
subagents/independent-verifier.md
workflows/bounded-fix-verify.md
hooks/pre-completion-evidence.md
scripts/verify_evidence.py
```

## Installation
Requires Python 3.9+ and Git for automatic current-tree detection. Copy the package into the repository. Replace example .NET commands with the repository's canonical commands before enforcement.

## Configuration
Edit `config/verification-contract.json`: define risk levels, check IDs, exact commands, required exit codes, evidence freshness, and max attempts. The included commands are a working example, not a claim that every .NET repository uses them.

## Evidence schema
`.agent/evidence.json` is an array. Each required record contains: `check_id`, `command`, `tree_sha`, `started_at`, `ended_at`, `exit_code`, `output_sha256`, and `log_path`. Evidence producers should hash the complete captured output and keep the referenced log available to the verifier.

## Usage
After checks have run and evidence records exist:

`python3 scripts/verify_evidence.py --contract config/verification-contract.json --evidence .agent/evidence.json --risk medium`

Exit 0 = PASS, 2 = invalid inputs, 3 = verification BLOCK.

## Workflow
Follow `workflows/bounded-fix-verify.md`: Observe → classify risk → form testable hypothesis → implement → focused verify → bounded retry → final canonical verification → independent evidence validation. The default maximum is three fix attempts.

## Metrics
Track unsupported completion claims, required-check coverage, attempts/task, unchanged-tree duplicate full-suite runs, verification duration/cost, and post-completion regressions.

## Verification
A completion claim is valid only when the validator passes for the current tree and the Independent Verifier confirms the contract. High-risk work must not rely solely on the implementing agent.

## Safety
Do not bypass pre-commit/CI gates to make progress. Preserve shell exit status. Do not downgrade risk to obtain PASS. Destructive or production actions require explicit human approval. This package complements, rather than replaces, server-side branch protection and CI.

## Failure handling
Detection: validator BLOCK or failed required check. Evidence: command/log/tree record. Retry: at most `max_fix_attempts`, each based on new evidence. Fallback: report BLOCKED with smallest next action. Escalation: human review for unavailable canonical environment, contradictory evidence, or dangerous action. Never retry indefinitely.

## Implemented / Measured / Verified
**Implemented**: contract, hook, workflow, and evidence producer integration exist. **Measured**: baseline and task metrics are captured. **Verified**: all current-tree contract checks and independent validation pass. These states must remain distinct.

## Definition of Done
Current evidence is documented; risk and required checks are known; canonical limitations are identified; all required checks pass on the current tree; no verification bypass exists; retry count is within bounds; independent verification passes; metrics are recorded; no blocking risk remains.

## Customization
Add repository-specific risk rules, platform checks, UI/browser verification, security scans, schema migration tests, or CI artifact validation. Keep check selection proportional: focused during iteration, canonical at the final checkpoint required by risk.