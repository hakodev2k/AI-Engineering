# Concurrent Session Turn Serialization Guard

## Topic
Concurrent Session Turn Serialization Guard

## Category
Security

## Problem
Concurrent or replayed agent turns can execute against stale session snapshots. A later turn may not observe an earlier committed side effect, and fallback/retry logic may reconstruct model-visible history without already-running external work. The result can be duplicate dispatches, duplicate agents, repeated writes, or conflicting mutations.

## Evidence
`evidence/research.md` documents current public reports from Hermes Agent, Claude Code, and Warp showing stale-session duplicate dispatches, fallback replay of already-started agents, and cancelled tool calls whose external effects had already occurred.

## Existing approach
Common defenses include tool-level idempotency keys, cancellation tokens, optimistic transcript persistence, retry limits, and duplicate-call detection.

## Existing limitations
Those mechanisms do not guarantee that a write decision is based on the latest session revision. They can also fail when a retry uses different arguments for the same logical action, when execution receipts disappear from model-visible history, or when a timeout/cancellation hides a committed external effect.

## Proposed improvement
Introduce an action-time consistency boundary for side effects:

1. Carry a stable logical operation ID across retries and fallbacks.
2. Record the session revision used to make the decision.
3. Re-check the current revision immediately before execution.
4. Store execution receipts outside model-visible transcript history.
5. Reconcile stale, started, or unknown operations before retrying.
6. Preserve parallel read-only work while serializing or compare-and-swapping writes.

## Architecture
The package separates deterministic admission from judgment-heavy reconciliation. `scripts/session_revision_gate.py` performs the blocking revision/receipt checks. The skill defines the investigation procedure, the rule file defines invariants, the workflow handles bounded recovery, and an independent reviewer verifies high-impact reconciliation outcomes.

## Actual package tree
```text
concurrent-session-turn-serialization-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── action.json
├── hooks/
│   └── pre-side-effect-gate.md
├── rules/
│   └── side-effect-consistency.md
├── scripts/
│   └── session_revision_gate.py
├── skills/
│   └── session-consistency-analysis.md
├── subagents/
│   └── reconciliation-reviewer.md
├── tests/
│   └── concurrency-fixtures.json
└── workflows/
    └── reconcile-before-write.md
```

## Installation
Requires Python 3.9+ and no third-party Python packages.

## Configuration
Edit `config/policy.json` to classify write-capable operations and define reconciliation behavior. Keep high-impact operations classified as writes. Do not reduce security boundaries to improve throughput.

## Usage
Run the deterministic gate before a side effect:

```bash
python3 scripts/session_revision_gate.py examples/action.json --policy config/policy.json
```

Interpret exit codes:

- `0`: `allow`
- `10`: `already_committed`; return the prior result instead of executing again
- `20`: `reconcile`; refresh durable state before deciding
- `30`: `block`; a conflicting operation exists
- `2`: invalid input or policy

Integrations should use `hooks/pre-side-effect-gate.md` as the blocking boundary.

## Workflow
Follow `workflows/reconcile-before-write.md`:

**Observe → read current revision/receipts → diagnose → reconcile stale or unknown state → admit one write → persist receipt/revision → verify postcondition.**

Reconciliation is bounded to two attempts by default. The external side effect itself is not retried until its previous commit state is known.

## Metrics
Track:
- duplicate side effects per task/session;
- revision conflicts detected;
- duplicate executions prevented by receipts;
- reconciliation latency and success rate;
- side-effect calls with valid logical operation IDs;
- false blocks;
- read-only concurrency throughput.

## Verification
Use the records in `tests/concurrency-fixtures.json` as deterministic regression cases. Required behaviors are:

- fresh revision + no receipt => allow;
- stale revision => reconcile;
- matching committed receipt => already committed;
- reused operation ID with conflicting fingerprint => block;
- started/unknown prior operation => reconcile.

For integration verification, run two turns from the same revision against a test session and prove that at most one equivalent write reaches the external system. Then simulate a cancellation/fallback after an external commit and prove that the second attempt reconciles the durable receipt rather than executing again.

## Safety
- The gate is read-only and never performs the external mutation itself.
- Missing consistency infrastructure fails closed for side-effecting operations.
- Cancellation is never treated as proof of non-execution.
- Receipt records should use hashes/references instead of storing secrets or sensitive full payloads.
- High-impact reconciliation should be independently reviewed.

## Failure handling
### Detection
Revision mismatch, started/unknown receipt, conflicting fingerprint, missing metadata, or unavailable receipt store.

### Evidence
Preserve revision numbers, logical operation ID, sanitized action fingerprint, receipt ID/status, and target postcondition evidence.

### Retry policy
Retry metadata/reconciliation reads at most twice with bounded backoff. Do not retry the external mutation while commit state is unknown.

### Fallback
Keep read-only operations available while blocking the uncertain write.

### Escalation
Escalate unresolved or conflicting committed states to an operator/higher-level recovery workflow.

### Stop condition
Stop after a conclusive allow/already-committed/block decision or after two inconclusive reconciliation attempts.

## Implemented, Measured, Verified
- **Implemented:** deterministic revision/receipt gate, policy, rules, workflow, hook, reviewer, example, and regression fixtures are present.
- **Measured:** package metrics and baseline procedure are defined; production improvement must be measured in the target runtime rather than claimed in advance.
- **Verified:** package-level invariants and expected deterministic fixture outcomes are specified; deployment verification requires the integration concurrency/cancellation tests described above.

## Definition of Done
A deployment using this package is complete only when:

- evidence and current limitations are documented;
- every side-effecting path carries a logical operation ID and expected revision;
- durable receipts survive transcript reconstruction/fallback;
- stale revisions cannot directly execute writes;
- concurrency regression cases admit no duplicate equivalent write;
- cancellation/fallback cases reconcile prior execution before retry;
- high-impact outcomes receive independent verification;
- metrics are captured before and after rollout;
- no unresolved consistency conflict remains.

## Customization
Extend `write_capabilities` for domain-specific operations, replace the storage adapter with your session/receipt store, and derive canonical fingerprints from operation semantics. Keep the revision check and durable receipt boundary deterministic even when the surrounding orchestration uses an LLM.
