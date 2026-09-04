# Agent Orchestration Control-Event Integrity Guard

## Topic
Preserve semantic and causal integrity for synthetic UI/runtime, subagent lifecycle, wait/status, interruption and auto-continuation events before they affect model-visible context or tool routing.

## Category
Thinking

## Problem
Long-running and multi-agent systems rely on control-plane events that are not user instructions. If those events are flattened into natural-language transcript text, lose provenance/causal binding, or route through an incompatible tool class, agents can lose results, redo completed work, enter status loops, or act on synthetic content as though a user authored it.

## Evidence
`evidence/research.md` documents current public signals. The primary independent reports are Anthropic Claude Code issue #37040 (synthetic Desktop auto-continuation/dismissal interfering with agent results) and OpenAI Codex issue #38132 (agent-status intent routed to PowerShell placeholder output, causing a tool-selection loop). Claude Code issue #69525 provides an additional provenance/corruption signal.

## Existing approach
Many runtimes serialize meta/UI/lifecycle information into the same message stream used for user/model text and let the model infer both event meaning and tool routing.

## Existing limitations
Message text does not reliably encode provenance or causality. A synthetic string can look like user intent; a generic tool inventory allows a status intent to select shell instead of collaboration state; auto-continuation without a causal link can obscure completion/interruption facts. Tool-call IDs alone do not enforce higher-level lifecycle integrity.

## Proposed improvement
Use typed control-event envelopes with explicit source, synthetic flag, causal ID, lifecycle state, result reference and routing class. Validate these invariants before model re-entry, then create a compact model-facing summary from validated state. Do not request hidden chain-of-thought; improve reasoning reliability by improving observable facts.

## Architecture
```text
agent-orchestration-control-event-integrity-guard/
├── README.md
├── config/
│   └── control-event-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-model-reentry-control-check.md
├── rules/
│   └── control-event-rules.md
├── schemas/
│   └── control-event.schema.json
├── scripts/
│   └── control_event_guard.py
├── skills/
│   └── control-event-diagnosis.md
├── subagents/
│   └── independent-event-verifier.md
├── tests/
│   └── test_control_event_guard.py
└── workflows/
    └── observe-diagnose-replay-verify.md
```

## Installation
Python 3.10+; reference executable uses only the standard library. Copy the package directory intact.

## Configuration
`config/control-event-policy.json` defines accepted event kinds, terminal states and legal routing classes. Extend event kinds deliberately; do not add `shell` as a routing class for wait/status merely to suppress a failure.

## Usage
Normalize a runtime event, keep an array of active/known causal IDs, then validate:

```bash
python scripts/control_event_guard.py event.json \
  --policy config/control-event-policy.json \
  --known-causal causal-ids.json \
  --prior-state running

python -m unittest tests/test_control_event_guard.py
```

Exit codes: `0` pass, `2` blocked invariant, `3` invalid input/policy.

## Workflow
Follow `workflows/observe-diagnose-replay-verify.md`: Observe → baseline → diagnose first violated invariant → form hypothesis → repair host encoding/routing → replay → independently verify. Repair loops are bounded to two iterations.

## Metrics
Track invalid control events per 1,000, synthetic events misclassified as user turns, wrong routing-class events, lost result incidents, duplicate subagent launches after terminal completion, status/wait loop iterations, unsupported completion claims, and rework time.

## Verification
- **Implemented**: typed envelope and pre-model-reentry validation are integrated.
- **Measured**: before/after traces and metrics exist for the failing runtime path.
- **Verified**: original failure fixture is blocked/corrected, valid fixtures pass, lifecycle/result provenance remains intact, and `subagents/independent-event-verifier.md` signs off.

The packaged unit tests verify the reference guard, not a specific vendor client.

## Safety
Synthetic or unverified control content must never silently become user intent. Consequential actions that appear only in synthetic/unverified content require fresh explicit human/user approval. The guard does not weaken tool permission, sandbox or repository protections.

## Failure handling
Detection: invalid provenance, unknown causal ID, terminal-state regression, completion without result reference, incompatible route, malformed event, or replay mismatch. Evidence: preserve the event window and validated user goal. Retry: maximum two repair iterations. Fallback: stop auto-continuation, quarantine malformed event, resume only from a fresh valid transition. Escalation: orchestration/runtime owner. Stop condition: unresolved provenance/causal state or independent verification failure.

## Definition of Done
Current evidence documented; baseline captured; existing limitations identified; first violated invariant identified; typed event path implemented; tests pass; before/after metrics collected; repair loops bounded; valid user instructions preserved; no synthetic control text masquerades as user intent; no unsupported completion claim remains; independent verification complete; no blocking issue remains.

## Customization
Add event kinds and lifecycle states for your runtime, but keep provenance, causal ID, terminal-state monotonicity, completion result references and capability-compatible routing as mandatory invariants.
