# Tool Output Payload Eviction Guard

**Category:** Token

## Problem
Long-running AI-agent sessions can fail before nominal token-window exhaustion because large tool outputs, repeated images/base64, MCP schemas, and serialized request bytes persist in history. Reactive compaction or blanket truncation is insufficient when a headless session cannot rewind or when downstream tools require exact payloads.

## Evidence
See `evidence/research.md`. Current public issue reports document hard request-size failures, noninteractive recovery gaps, hidden MCP schema consumption, and harness-level payload truncation.

## Existing approach and limitation
Compaction, output caps, deferred tools, and manual restart help, but are usually reactive or global. They do not consistently classify payload fidelity requirements before retention.

## Proposed improvement
Treat tool results as managed lifecycle objects: measure before retention, classify, deduplicate, externalize referenceable data, preserve exact payloads losslessly, reserve emergency headroom, and block unsafe dispatch before provider rejection.

## Architecture
The Skill defines classification and lifecycle decisions. Rules enforce budgets and fidelity. The Context Budget Auditor independently verifies state. The workflow performs bounded remediation. The pre-dispatch hook blocks unsafe requests. The profiler provides deterministic byte/token/duplicate evidence.

## Package tree
```text
README.md
evidence/research.md
skills/payload-lifecycle-analysis.md
rules/context-retention-rules.md
subagents/context-budget-auditor.md
workflows/profile-evict-verify.md
hooks/pre-dispatch-budget.md
scripts/payload_profiler.py
```

## Installation
Requires Python 3.9+. No third-party dependency is required. Copy the package into an agent repository and invoke the hook from the harness before model dispatch.

## Configuration
Set provider-specific `soft-bytes` and `hard-bytes`; define an approved artifact store; identify secret-handling requirements; declare consumers that require exact round-trip data. The README's 20 MB command is only an example matching one observed provider failure class, not a universal limit.

## Usage
Create a JSON array containing retained tool-result objects and run:

`python3 scripts/payload_profiler.py session-tool-results.json --soft-bytes 500000 --hard-bytes 20000000`

Exit 0 is within the byte gate; 2 indicates invalid input/configuration; 3 blocks dispatch at >=90% of the configured hard byte limit.

## Workflow
Follow `workflows/profile-evict-verify.md`: Observe → baseline → diagnose → hypothesize → externalize/dedupe → measure again → verify fidelity and task quality. Maximum two remediation cycles.

## Metrics
Track bytes/request, estimated tokens/request, duplicate bytes, externalized bytes, context utilization, hard-limit prevention events, task success, and regression rate.

## Verification
1. Capture baseline profiler output.
2. Apply lifecycle decisions.
3. Capture post-change profiler output.
4. Hash-check every exact-round-trip reference.
5. Rerun task-specific tests/evaluation.
6. Have the Context Budget Auditor return PASS.

## Safety
Never externalize secrets to an unapproved store. Never truncate exact-round-trip data silently. Never save tokens by removing context required for correctness. Blocking an unsafe dispatch is preferable to corrupting state.

## Failure handling
Detection: hook exit code or hash mismatch. Evidence: profiler/audit JSON. Retry: maximum two changed remediation attempts. Fallback: checkpoint and restart/recover with references. Escalation: operator review. Stop on hash mismatch, unsafe storage, unsupported exact-data dereference, or no improvement after two cycles.

## Implemented / Measured / Verified
**Implemented** means the guard artifacts and integration exist. **Measured** means before/after byte/token metrics were captured. **Verified** means fidelity checks and task-level tests pass with independent audit. Do not conflate these states.

## Definition of Done
Evidence is documented; baseline captured; oversized payloads classified; improvement applied; post-change metrics are lower or safer; exact data remains hash-identical; task tests pass; no secret exposure occurs; projected dispatch stays below the blocking threshold; independent audit passes; no blocking issue remains.

## Customization
Replace the dependency-free token estimate with the target model tokenizer for accurate token accounting, add provider-specific request-size limits, and adapt artifact references to the host harness while preserving the rules and verification contract.