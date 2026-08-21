# Subagent Context Envelope Admission Gate

## Category
Token

## Problem
A subagent can be impossible to run before useful work starts when its fixed instructions, tool schemas, inherited context, attachments, and reserved output exceed the context window of the model that actually serves the subagent. Mixed-model orchestration can also use the coordinator's context assumptions instead of the subagent model's real ceiling.

## Evidence
Current reports in Claude Code show both failure modes: issue #84947 reports roughly 214k tokens of fixed subagent overhead against a 200k limit, while issue #83355 reports smaller-window subagents missing compaction because the coordinator model's window is used. See `evidence/research.md` for observed evidence, interpretation, existing approaches, limitations, and sources.

## Existing approach and limitation
Typical systems discover overflow only when the provider rejects the request, reduce caller prompts after failure, use process-global compaction thresholds, or manually remove tools/context. These approaches can be too late, cannot fix oversized fixed agent definitions, can constrain unrelated larger-context models, or can remove correctness-critical context.

## Proposed improvement
Measure the entire subagent context envelope before dispatch. Admission is calculated against the actual execution model, with mandatory output reserve and headroom. If it does not fit, the gate first proposes removal of explicitly optional context, then an approved model reroute, otherwise it blocks with an exact deficit. Required correctness and security context cannot be discarded.

## Architecture
The analyst skill inventories and measures context. The deterministic gate evaluates the measured envelope against policy. A blocking pre-dispatch hook enforces the result. The workflow permits at most two measurable remediation cycles. An independent Context Budget Auditor verifies arithmetic and required-context preservation before dispatch.

## Package tree
```text
subagent-context-envelope-admission-gate/
├── README.md
├── config/
│   └── context-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-dispatch-context-gate.md
├── rules/
│   └── subagent-context-admission.md
├── scripts/
│   └── context_fit_gate.py
├── skills/
│   └── context-envelope-analysis.md
├── subagents/
│   └── context-budget-auditor.md
├── tests/
│   └── test_context_fit_gate.py
└── workflows/
    └── measure-and-dispatch.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the package into an agent repository. Integrate the hook immediately before subagent serialization/provider dispatch. Supply token measurements from the tokenizer used by the target model where possible.

## Configuration
Edit `config/context-policy.json`:
- `minimum_output_reserve`: tokens reserved for the subagent response.
- `minimum_headroom_tokens`: additional safety margin.
- `max_utilization_ratio`: maximum allowed context utilization.
- `approved_reroute_models`: explicit allowlist/map for larger-context fallback models.
- `optional_reduction_order`: priority order for removable optional segments.
- `fail_closed_on_unknown_limit`: blocks dispatch when the selected model limit is unknown.

Do not put credentials in this file.

## Usage
Create an envelope JSON containing `model`, `context_limit`, component token counts, required component names, output reserve, and optional reroute candidates. Then run:

```bash
python3 scripts/context_fit_gate.py envelope.json --policy config/context-policy.json
```

Use the exit code and JSON decision described in `hooks/pre-dispatch-context-gate.md`.

## Workflow
Follow `workflows/measure-and-dispatch.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Apply one safe remediation → Measure again → Independent verification → Dispatch or block. Retries are bounded to two remediation cycles and an unchanged overflowing envelope is never retried.

## Metrics
Track total input tokens, required input tokens, fixed overhead, utilization, headroom/deficit, optional tokens removed, reroute count, pre-dispatch blocks, post-admission overflow failures, and retained-required-context rate.

## Verification
Run:

```bash
python3 tests/test_context_fit_gate.py
```

The fixtures verify safe admission, fixed required-context overflow, optional reduction, approved rerouting, and fail-closed behavior for an unknown model limit. Before production enforcement, add representative envelopes from the actual framework and tokenizer.

## Safety
The gate MUST NOT lower security or correctness requirements to save tokens. Required context cannot be reclassified merely to obtain `allow`. Unknown limits fail closed by default. Model rerouting is allowlisted and recalculates the entire envelope.

## Failure handling
Detection is deterministic from measured inputs. Invalid measurements block. The workflow allows at most two changed remediation attempts. If required context still cannot fit, the fallback is an approved larger-context model; otherwise stop and escalate the context/agent design. Never repeatedly resubmit the same overflowing request.

## Status semantics
- **Implemented:** policy, deterministic gate, hook, workflow, rules, auditor, and tests exist.
- **Measured:** a real task envelope has baseline and post-remediation measurements.
- **Verified:** tests pass, independent audit passes, and admitted representative envelopes do not overflow the selected execution model.

This repository package provides the implementation; production improvement is not claimed until real workload measurements satisfy the verification criteria.

## Definition of Done
Evidence is documented; actual execution model is identified; complete baseline envelope is measured; required context is preserved; any remediation is remeasured; unit and representative tests pass; independent audit passes; and no unresolved blocking overflow remains.

## Customization
Extend component names to match the host framework, wire in the model-specific tokenizer, and populate approved reroute models from trusted model metadata. Preserve the invariant that admission is based on the model actually serving the subagent.
