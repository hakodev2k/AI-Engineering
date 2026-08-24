# Structured-Output Retry Budget Guard

**Category:** Thinking

## Problem
Agents can finish their substantive investigation but become trapped at the terminal structured-output boundary: malformed or schema-invalid output is retried hundreds of times, a single subagent can block a parallel barrier, and full-task reruns may discard useful completed work.

## Evidence
See `evidence/research.md`. Claude Code reports in June 2026 show 229–395 repeated StructuredOutput attempts and stalled workflows; separate Strands, LangChain and Zeroshot reports show inconsistent validation/retry behavior and the need to repair the exact completed output rather than rerun the entire task.

## Existing approach and limitation
Provider/tool retries often lack a retry budget, identical-failure detection, per-agent deadline, or distinction between task execution and terminal-output repair. Generic max-turn guards are too coarse because the useful work may already be complete.

## Proposed improvement
Treat structured output as a terminal contract with executor-owned validation, a bounded repair budget, repeated-failure fingerprinting, and a hard handoff to failure/review instead of indefinite model retries. Preserve the original raw result as evidence; never fabricate missing facts during repair.

## Architecture
```text
.
├── README.md
├── evidence/research.md
├── config/retry-policy.json
├── skills/structured-output-recovery.md
├── rules/structured-output-rules.md
├── subagents/structured-output-verifier.md
├── workflows/validate-repair-stop.md
├── hooks/post-model-output-gate.md
├── scripts/structured_output_guard.py
└── tests/test_structured_output_guard.py
```

## Installation
Python 3.10+, standard library only.

## Usage
```bash
python scripts/structured_output_guard.py --events run-events.json --policy config/retry-policy.json
python -m unittest tests/test_structured_output_guard.py
```

Events are JSON objects containing `payload`, `valid`, and optional `error` for each terminal structured-output attempt.

## Workflow
Capture raw output → validate locally → classify failure → repair the same raw artifact within a bounded budget → validate again → if still invalid, stop and return explicit failure evidence. A full task rerun requires a separate decision that proves the underlying task work itself is invalid or incomplete.

## Metrics
Invalid structured-output attempts/task; identical invalid repeats; repair success rate; terminal-output time; tokens spent after substantive work completed; workflows blocked by one child; full-task reruns avoided; unsupported-field regression rate.

## Verification
**Implemented:** policy, guard script, workflow, hook and tests exist.

**Measured:** baseline captures retry count, terminal duration and token burn after the last substantive evidence-gathering action.

**Verified:** malformed/identical terminal attempts stop at policy limits, a valid repaired output passes, no infinite retry path exists, and the verifier confirms repaired output was derived only from captured raw evidence.

## Safety
Repair MUST preserve meaning and MUST NOT invent facts needed only to satisfy a schema. Dangerous actions are never retried as part of output repair. Raw output is retained separately for audit.

## Failure handling
Detection: invalid local validation or repeated failure fingerprint. Maximum repair attempts default to 2; maximum identical invalid attempts default to 2. Fallback: return explicit structured-output failure plus raw artifact and validation errors. Escalation: human/parent workflow decides whether the underlying task must be rerun. Stop condition: retry budget or terminal deadline reached.

## Definition of Done
Evidence documented; baseline measured; validation errors classified; bounded repair implemented; tests pass; terminal loops stop deterministically; verifier confirms evidence fidelity; no blocking issue remains.