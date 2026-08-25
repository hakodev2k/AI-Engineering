# Latency Causal Attribution Evidence Gate

## Topic
Evidence-gated causal attribution for AI-agent latency investigations.

## Category
Thinking

## Problem
Agent runtimes may expose one elapsed-time value spanning approval wait, tool execution, result ingestion, model re-entry, and UI/runtime overhead. An agent can then incorrectly promote that mixed interval into a tool-performance root cause and make a code/configuration change on false evidence.

## Evidence
See `evidence/research.md`. Codex issue #38731 (2026-08-15) documents approval-wait time being interpreted as tool execution and changing a technical recommendation; issue #40087 (2026-08-22) independently requests timing that separates model, tool, and overhead/wait phases.

## Existing approach
Whole-turn timers, tool-handler duration, generic traces, progress messages, and manual log inspection.

## Existing limitations
Whole-turn time is semantically ambiguous, raw traces do not enforce claim discipline, and model-generated narratives can convert correlation into causation.

## Proposed improvement
A deterministic phase gate requires observable timing provenance before a latency observation may support a root-cause claim or implementation decision. Approval wait, execution-only time, and post-tool overhead remain distinct.

## Architecture
- `scripts/latency_phase_gate.py`: dependency-free validator and normalizer.
- `config/policy.json`: accepted claim phases and timing policy.
- `rules/attribution-rules.md`: enforceable reasoning constraints.
- `skills/latency-attribution.md`: reusable evidence procedure.
- `subagents/independent-attribution-reviewer.md`: independent verification.
- `workflows/research-diagnose-implement.md`: bounded primary workflow.
- `workflows/failure-recovery.md`: bounded recovery.
- `hooks/pre-performance-decision.md`: deterministic pre-decision gate.
- `tests/test_latency_phase_gate.py`: regression tests.
- `evidence/research.md`: current public evidence.

## Actual package tree
```text
latency-causal-attribution-evidence-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-performance-decision.md
├── rules/attribution-rules.md
├── scripts/latency_phase_gate.py
├── skills/latency-attribution.md
├── subagents/independent-attribution-reviewer.md
├── tests/test_latency_phase_gate.py
└── workflows/
    ├── failure-recovery.md
    └── research-diagnose-implement.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Use `config/policy.json`. Keep `block_ambiguous_causal_claims` enabled and do not increase clock-skew tolerance merely to make bad traces pass.

## Usage
`python3 scripts/latency_phase_gate.py timing.json --policy config/policy.json --claim-phase tool_execution --output report.json`

Exit codes: `0 attributable`, `2 ambiguous/block`, `3 invalid input`.

## Workflow
Observe → measure phase boundaries → diagnose → form at most three hypotheses → run discriminating experiment → implement → measure again → independent verification.

## Metrics
Unsupported latency claims/task; ambiguous timing records; p50/p95 approval wait, execution and post-tool overhead; rework after disproven hypotheses; total task latency.

## Verification
**Implemented:** package artifacts and deterministic gate exist. **Measured:** real runtime traces are supplied and phase metrics are produced. **Verified:** an independent reviewer reproduces attribution, matched before/after evidence supports the change, tests pass, and safety/correctness do not regress.

Run `python3 -m unittest tests/test_latency_phase_gate.py`.

## Safety
Do not disable approval, sandboxing, authorization, validation, or correctness checks to obtain a better benchmark. Dangerous or irreversible experiments require explicit human approval.

## Failure handling
Retry bad instrumentation once, diagnosis at most three experiments, and implementation at most twice. Revert failed optimizations and escalate rather than relaxing the evidence gate.

## Definition of Done
Evidence documented; baseline captured; phase provenance complete; causal claim names a measured phase; implementation targets that phase; before/after metrics collected; tests pass; independent verification accepts; no blocking issue remains.

## Customization
Vendor trace adapters may map their events into the phase contract. Preserve the invariant that end-to-end time is not execution time unless the boundaries prove it.
