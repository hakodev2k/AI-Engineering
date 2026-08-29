# Agent Memory Write Provenance Quarantine Gate

**Category:** Security  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Persistent agent memory can make a transient indirect prompt injection durable. External text, retrieved documents, emails, tool outputs, or model summaries may be written into long-term memory and later recalled in a context where the agent has greater privileges. Without explicit provenance and trust boundaries, the model can treat recalled data as instruction or authority.

## Evidence
Current public signals are documented in `evidence/research.md`. Multiple independent projects in 2026 report or discuss memory poisoning, memory-layer prompt-injection persistence, and the absence of first-class write-time validators.

## Existing approach
Inference-time prompt-injection filters, output validators, memory middleware, vector-store ACLs, and manual provenance metadata are already used.

## Existing limitations
These mechanisms are frequently optional; many stores accept plain text with incomplete provenance; classifier output does not establish authority; and read-time prompts often flatten observations and instructions together. A write can therefore be syntactically benign yet unsafe when later recalled into a privileged workflow.

## Proposed improvement
Treat durable memory insertion as a trust transition. Require provenance, classify requested memory authority, quarantine low-trust instruction-bearing content, block secret/privilege violations, preserve provenance on retrieval, and independently verify replay behavior before considering the control verified.

## Architecture
```text
README.md
config/policy.example.json
evidence/research.md
skills/memory-write-threat-analysis.md
rules/memory-security-rules.md
subagents/memory-security-verifier.md
workflows/observe-gate-replay-verify.md
hooks/pre-memory-write-gate.md
scripts/memory_write_gate.py
tests/test_memory_write_gate.py
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Copy `config/policy.example.json` and tune the trust taxonomy, protected memory classes, age/expiry rules, and source types. Keep privileged classes strict; do not make external web/email/tool output trusted by default.

## Usage
Prepare a candidate JSON object containing `text`, `source_id`, `source_type`, `trust_level`, `writer_id`, `acquired_at`, `memory_class`, and optionally `expires_at`/`requested_privilege`.

```bash
python scripts/memory_write_gate.py candidate.json --policy config/policy.example.json --json-out gate-report.json
python -m unittest tests/test_memory_write_gate.py
```

Exit codes: `0=allow`, `2=quarantine`, `3=block`, `1=input/runtime failure`.

## Workflow
Use `workflows/observe-gate-replay-verify.md`: **Observe → baseline → diagnose → hypothesis → gate → measure again → independent replay verification**. Retries are bounded to two implementation attempts.

## Metrics
- provenance completeness;
- malicious fixture acceptance rate;
- replay attack success rate;
- safe-memory acceptance rate;
- quarantine/review false-positive rate;
- p95 gate latency;
- number of quarantined memories entering privileged prompts.

## Verification
**Implemented:** write gate and trust policy integrated before persistence.  
**Measured:** baseline and post-change fixture metrics captured.  
**Verified:** malicious privileged replay succeeds zero times in the approved fixture suite, tests pass, provenance remains intact, and an independent verifier approves the result.

## Safety
Quarantined data is not deleted merely because it is suspicious; retain it in an isolated review channel when investigation requires it. It MUST NOT become system/tool instruction. Raw secrets MUST NOT be copied into audit reports. Dangerous or irreversible promotion into privileged memory requires explicit human approval.

## Failure handling
Detection: nonzero gate exit, missing provenance, replay-test failure, secret finding, or privilege mismatch. Retry once only for corrected operational/input errors; at most two implementation attempts. Fallback is quarantine/fail-closed. Escalate unresolved privileged-memory failures to a human security owner.

## Definition of Done
Evidence documented; baseline captured; limitation/root cause identified; gate implemented; tests pass; replay evidence collected; provenance preserved; metrics compared; risks documented; approvals obtained where required; independent verification complete; no blocking issue or secret exposure remains.

## Customization
Extend deterministic patterns and adapters for your memory backend, but keep provenance mandatory and separate memory *content* from memory *authority*. Provider/model classifiers may be added as secondary signals; they SHOULD NOT replace deterministic privilege and provenance rules.
