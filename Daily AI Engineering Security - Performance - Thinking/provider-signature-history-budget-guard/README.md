# Provider Signature History Budget Guard

**Category:** Token

## Problem
Opaque provider metadata such as Gemini `thoughtSignature`/`textSignature` can silently consume large context and request budgets. Keeping every historical signature can cause context-limit failures and latency/cost growth; stripping them indiscriminately can break mandatory function-call replay or reduce reasoning continuity.

## Evidence
`evidence/research.md` documents independent Gemini CLI and OpenClaw reports of signature-driven context bloat, plus evidence that over-aggressive removal can be correctness-degrading. Google's current protocol documentation distinguishes required function-calling replay from optional/recommended non-function-call history.

## Existing approach
Frameworks typically retain full provider responses, normalize them into generic history, or compress/strip old metadata when context grows.

## Existing limitations
Generic history loses signature lifecycle semantics. Visible token meters may omit opaque metadata. Age-only pruning can delete a still-required signature, while full retention creates unbounded overhead.

## Proposed improvement
Maintain a deterministic signature lifecycle ledger. Preserve `required_active` signatures byte-for-byte, budget `recommended_recent` signatures explicitly, and remove `archival` signatures from outbound model context while optionally retaining non-sensitive hashes for diagnostics.

## Architecture
```text
provider-signature-history-budget-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-request-context-budget.md
├── rules/
│   └── signature-retention-rules.md
├── scripts/
│   └── signature_budget_guard.py
├── skills/
│   └── signature-lifecycle-analysis.md
├── subagents/
│   └── token-verifier.md
├── tests/
│   └── test_signature_budget_guard.py
└── workflows/
    └── measure-prune-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
`config/policy.json` defines recognized signature fields, active function-call part types, recent-turn retention, optional signature-byte budget, token estimation ratio, required context reserve, and fail-closed behavior.

The provided byte-to-token ratio is only an estimate. Where a provider tokenizer/count endpoint is available, use the provider measurement for final before/after reporting.

## Input contract
The reference script expects a JSON object with a `turns` array. Each turn can include `role`, `active_loop`, and `parts`. Parts may include a `type` and one configured signature field. `active_loop=true` plus a configured function-call part type marks the signature as protocol-required for the active continuation.

## Usage
`python scripts/signature_budget_guard.py --input <history.json> --policy config/policy.json`

The script emits a transformed copy, lifecycle ledger, decision, and signature-byte metrics. It never modifies the input file and never decodes opaque signatures.

## Workflow
Follow `workflows/measure-prune-verify.md`: **Measure → Diagnose → Classify → Budget → Measure again → Replay/quality verify**. Maximum policy-adjustment retries: 2.

## Metrics
- Signature bytes/request before and after.
- Estimated and provider-measured tokens/task.
- Cost/task and request latency.
- Context utilization/headroom.
- Required function-call replay success rate.
- Quality regression rate on representative multi-turn fixtures.

## Verification
Run:

`python -m unittest tests/test_signature_budget_guard.py`

Then run provider-specific function-call replay and multi-turn quality fixtures. `subagents/token-verifier.md` must independently confirm both overhead reduction and correctness.

## Safety
Opaque signatures are never decoded or printed by the guard. Required active signatures are never removed to achieve token savings. If required state cannot fit the reserved budget, the request is blocked rather than silently degraded.

## Failure handling
**Detection:** missing required signature, context overflow, provider validation error, or quality regression.  
**Evidence:** sanitized lifecycle ledger, byte/token metrics, provider/model identifiers, fixture outcomes.  
**Retry policy:** maximum 2 retention-policy adjustments.  
**Fallback:** restore more metadata and remove other noncritical context; if mandatory replay still cannot fit, stop before provider submission.  
**Escalation:** provider-adapter owner.  
**Stop condition:** required replay remains invalid or critical quality regression persists.

## Definition of Done
**Implemented:** lifecycle classifier, budget transformer, blocking pre-request hook and policy are integrated.  
**Measured:** exact signature bytes and before/after token/cost/latency metrics are captured.  
**Verified:** mandatory replay fixtures pass; archival metadata reduction is measurable; quality is similar or better within the accepted regression threshold; no critical context is lost; no blocking issue remains.

## Customization
Add provider-specific signature field names and part types only from documented contracts. Tune `recent_turns` and optional byte budgets with measured quality fixtures, never by deleting mandatory active protocol state.
