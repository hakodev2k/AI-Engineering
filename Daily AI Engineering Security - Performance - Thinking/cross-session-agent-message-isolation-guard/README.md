# Cross-Session Agent Message Isolation Guard

**Category:** Security

## Problem
Concurrent coding-agent sessions can become an unintended trust domain. Recent Claude Code reports show workflow children discovering/message-routing across unrelated sessions, sender attribution collapsing to the parent identity, and reply paths diverging from the originating child. That combination can import unrelated assumptions into code decisions or create an authorization-confusion path.

## Evidence
See `evidence/research.md`. The package is grounded in current 2026 Claude Code reports #89453, #72051, #65784, #84768 and #84831.

## Existing approach
Current approaches include per-message approvals, relayed-authority hardening, agent-team hierarchy, and UI labels.

## Existing limitations
Those controls do not by themselves prove workflow membership, stable sender lineage, or reply-route integrity on every delivery surface.

## Proposed improvement
Treat each message as an authorization envelope. Default-deny workflow children crossing workflow boundaries; keep human authority non-delegable; bind replies to the original sender/recipient tuple; require stable IDs; fail closed on missing provenance.

## Architecture
The deterministic validator is the enforcement primitive; rules and workflow define integration; a separate security-review role verifies behavior.

## Actual package tree
```text
cross-session-agent-message-isolation-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-delivery-gate.md
├── rules/
│   └── message-isolation.rules.md
├── scripts/
│   └── message_policy.py
├── skills/
│   └── message-boundary-analysis.md
├── subagents/
│   └── message-security-reviewer.md
├── tests/
│   └── test_message_policy.py
└── workflows/
    └── adopt-and-verify.md
```

## Installation
Requires Python 3.9+. Copy this directory intact. No third-party packages are required.

## Configuration
The host must normalize delivery metadata into a JSON envelope containing stable sender/recipient IDs and role. Workflow children also require workflow and parent lineage. `same_workflow` MUST come from a trusted registry, not the model.

## Usage
Run a single decision:

```bash
python scripts/message_policy.py --input envelope.json
```

Run tests:

```bash
python -m unittest tests/test_message_policy.py
```

## Workflow
Observe → baseline policy audit → diagnose discovery/identity/authority/routing → implement pre-delivery gate → measure again → independent verification. Maximum two implementation retries per run.

## Metrics
Track blocked cross-workflow messages, missing provenance, relayed-human-authority attempts, reply-route mismatches, approvals, and false positives.

## Verification
**Implemented** means the gate executes before recipient model ingestion. **Measured** means before/after trace metrics exist. **Verified** means all tests pass and an independent reviewer observes zero unapproved cross-workflow delivery and zero reply-route mismatch in the selected trace set.

## Safety
Never infer trust from same machine/user or display name. Never allow an agent message to stand in for human approval. Do not log full message bodies by default.

## Failure handling
Detection: validator deny/error or failed regression. Evidence: reason code plus envelope metadata. Retry: at most two policy/integration revisions. Fallback: disable child cross-session messaging or require human mediation. Escalation: runtime owner. Stop condition: no stable pre-delivery identity/routing primitive.

## Definition of Done
Current evidence documented; baseline captured; policy integrated; tests pass; cross-workflow and authority attacks blocked; metrics collected; independent verification complete; no unresolved blocking routing defect.

## Customization
Extend roles or approval semantics only by preserving the core invariants: stable identity, explicit workflow membership, non-delegable human authority, and reply correlation.
