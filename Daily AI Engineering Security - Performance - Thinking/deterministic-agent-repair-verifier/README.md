# Deterministic Agent Repair Verifier

**Category:** Thinking

## Problem
Agent runtimes can hang after tool errors, retry identical failed actions, search for already-resolved problems, or claim success without proving that required checks actually ran. Per-step LLM judging adds cost and still does not guarantee observable completion.

## Evidence
See `evidence/research.md` for current Hermes Agent issues and 2026 research on deterministic failure detection/repair and structured feedback.

## Existing approach
Common patterns are blind retry, fixed iteration caps, raw error text fed back to the model, another LLM used as judge, or trust in a textual completion claim.

## Existing limitations
These approaches often lack explicit goal-state predicates, required-call coverage, progress fingerprints, and structured repair evidence. They therefore confuse slow progress with loops and prose confidence with verified completion.

## Proposed improvement
Wrap the agent loop in a deterministic acceptance-and-repair protocol: define observable predicates, check whether the target already exists, fingerprint attempts, validate required-call coverage, emit structured repair feedback, allow only bounded evidence-driven retries, and verify final completion independently.

## Architecture
```text
task
  -> acceptance contract + current-state check
  -> implementation attempt + fingerprint
  -> deterministic post-attempt verifier
     -> verified
     -> structured repair -> bounded retry
     -> stop / escalate
  -> independent verifier for final/high-risk completion
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/acceptance-contract.md
skills/structured-repair.md
rules/repair-loop-policy.md
subagents/independent-verifier.md
workflows/verify-repair-retry.md
hooks/post-attempt-verification.md
scripts/repair_verifier.py
```

## Installation
Python 3.10+ is sufficient. The deterministic verifier has no third-party dependencies.

## Configuration
`config/policy.json` defaults to three repair attempts, one duplicate latest-attempt occurrence, complete predicate and required-call coverage, blocking unverified success, and independent verification for high-risk work.

## Usage
1. Build `contract.json` using `skills/acceptance-contract.md`.
2. Check the current environment before mutation; if all predicates already pass, return `already-satisfied`.
3. After each attempt, record passed predicates, observed required calls, attempt fingerprint, observations, and admissible repair actions in `run-result.json`.
4. Execute the hook command from `hooks/post-attempt-verification.md`.
5. On `repair`, use `skills/structured-repair.md` and run only a changed, evidence-supported attempt.
6. On `verified`, hand off to `subagents/independent-verifier.md` for final/high-risk verification.
7. On `stop`, preserve evidence and end autonomous retries.

Example contract:
```json
{
  "required_predicate_ids": ["tests-pass", "config-correct"],
  "required_calls": ["dotnet test"]
}
```

Example run result:
```json
{
  "passed_predicate_ids": ["config-correct"],
  "observed_calls": ["dotnet test"],
  "attempt_fingerprints": ["sha256:attempt-1"],
  "attempt": 1,
  "observations": {"tests-pass": "3 tests failed"},
  "admissible_actions": ["inspect the three failing tests", "re-evaluate the implementation hypothesis"]
}
```

## Workflow
Use `workflows/verify-repair-retry.md`: Observe → Measure current state → Diagnose failed predicates → Form hypothesis → Implement smallest safe repair → Measure again → structured bounded retry if needed → independent verification.

## Metrics
- recovery success rate
- deterministic predicate coverage
- required-call coverage
- duplicate retries blocked
- mean repair attempts
- unsupported success claims blocked
- LLM judge calls avoided
- time/tokens per repaired task

## Verification
**Implemented:** acceptance and repair skills, enforceable rules, bounded workflow, post-attempt hook, independent verifier, policy, and executable deterministic verifier are included.

**Measured:** real deployments must collect before/after recovery metrics; this package does not claim performance gains without workload evidence.

**Verified:** completion requires all configured predicates and required calls, no blocking duplicate loop, and independent verification for high-risk tasks.

## Safety
Do not weaken acceptance criteria to terminate a loop. Dangerous or irreversible repair actions require explicit human approval. Deterministic checks should validate only observable requirements; semantic requirements that cannot be machine-checked remain subject to independent evidence review.

## Failure handling
Detection comes from failed predicates, missing required calls, tool errors, and duplicate fingerprints. Retries are capped at three by default. Identical attempts are blocked beyond policy. Unknown failures receive at most one diagnostic retry unless new evidence changes the hypothesis. When exhausted or unsafe, stop and preserve evidence rather than continuing indefinitely.

## Definition of Done
Current state checked; acceptance contract complete; tool failures surfaced; attempts fingerprinted; retries bounded; deterministic predicates and required calls pass; high-risk work independently verified; no unresolved blocking failure remains.

## Customization
Add domain-specific predicate evaluators around the script without moving hidden reasoning into the contract. Coding-agent examples include tests, build output, expected file hashes, schema state, API response contracts, migration status, and required security scanners.