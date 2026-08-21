# Context Compression Behavioral Drift Gate

**Category:** Token

## Problem
Automatic context compression can reduce prompt size while silently dropping constraints, identifiers, pending work, evidence, or safety boundaries. Recent framework issues show both premature compaction and an explicit lack of behavioral-drift checks.

## Evidence
See `evidence/research.md` for current public signals from LangChain Deep Agents, OpenClaw, and Hermes Agent.

## Existing approach
Typical systems trigger summarization at a token threshold, offload old tool results, or replace history with a generated summary.

## Existing limitations
Size reduction is usually measured more strongly than correctness preservation. Token accounting can also confuse cumulative session usage with current prompt size, causing unnecessary compaction.

## Proposed improvement
Create an immutable preservation contract before compaction, measure current prompt size, generate a non-destructive candidate, and require a deterministic post-compaction gate plus independent verification before activation.

## Architecture
```text
current context
  -> baseline + preservation contract
  -> candidate compression
  -> deterministic drift gate
  -> independent Context Verifier
  -> allow / bounded retry / reject
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/compression-baseline.md
skills/drift-verification.md
rules/context-budget-policy.md
subagents/context-verifier.md
workflows/measure-compress-verify.md
hooks/post-compaction-gate.md
scripts/context_drift_gate.py
```

## Installation
Requires Python 3.10+ only for the deterministic gate. No third-party package is required.

## Configuration
Edit `config/policy.json`. Defaults require 100% critical retention, 100% probe pass rate, at least 20% token reduction, and at most two compaction attempts.

## Usage
1. Apply `skills/compression-baseline.md` before destructive context changes.
2. Produce `baseline.json` with `before_tokens`, `required_contract_ids`, `critical_contract_ids`, and `critical_identifiers`.
3. Generate a candidate without deleting the original context.
4. Produce `candidate-result.json` with `after_tokens`, retained IDs, probe results, and attempt number.
5. Run the hook command documented in `hooks/post-compaction-gate.md`.
6. Have `subagents/context-verifier.md` independently review the result before activation.

Example baseline:
```json
{
  "before_tokens": 42000,
  "required_contract_ids": ["goal", "negative-constraint", "pending-test"],
  "critical_contract_ids": ["negative-constraint"],
  "critical_identifiers": ["src/AuthService.cs", "ISSUE-481"]
}
```

Example candidate result:
```json
{
  "after_tokens": 24000,
  "retained_contract_ids": ["goal", "negative-constraint", "pending-test"],
  "retained_critical_identifiers": ["src/AuthService.cs", "ISSUE-481"],
  "probe_results": [true, true],
  "attempt": 1
}
```

## Workflow
Use `workflows/measure-compress-verify.md`: Observe → Measure baseline → Diagnose token-heavy regions → Form compression hypothesis → Generate candidate → Measure again → Verify → bounded retry or complete.

## Metrics
- tokens/task and before/after prompt tokens
- token reduction ratio
- required invariant retention
- critical identifier retention
- probe pass rate
- rejected/retried compaction count
- post-compaction regression rate

## Verification
**Implemented:** deterministic gate, policy, workflow, skills, hook, and independent verifier are present.

**Measured:** each real adoption must supply before/after token counts and probe evidence; this package does not fabricate performance gains.

**Verified:** a candidate is verified only when all critical retention and probe thresholds pass and configured token reduction is achieved.

## Safety
Never delete the original context before final verification. Never reduce security boundaries or required correctness context solely to meet a token target. Unknown metrics remain unknown rather than being converted into claimed savings.

## Failure handling
Detection is deterministic through gate exit codes and missing contract IDs. Maximum retries default to two. On failure, keep/restore original context and fall back to selective offloading, retrieval-on-demand, prompt caching, or a larger context window. Escalate when critical requirements cannot be represented safely.

## Definition of Done
Evidence documented; baseline captured; original context recoverable; candidate measured; critical invariants and identifiers retained at policy threshold; probes pass; useful token reduction demonstrated; independent verifier reports Verified; no blocking issue remains.

## Customization
Add project-specific contract classes and probes without weakening critical thresholds. For coding agents, common probes include exact file/path retention, test command retention, acceptance-criteria checks, and unresolved-failure references.