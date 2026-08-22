# Subagent Output Channel Contract Guard

**Category:** Thinking

## Problem
A subagent can do real work but still deliver an unusable or misleading result when caller-defined output requirements conflict with host-injected reporting tools, unavailable structured-output tools, or ambiguous empty-result semantics.

## Evidence
See `evidence/research.md`. August 2026 Claude Code reports show `ReportFindings` overriding custom final-text contracts, background review instructions referencing an unavailable tool, and schema-bound workflows failing after substantial child-agent work.

## Existing approach and limitations
Prompt-only format instructions are vulnerable to conflicting host descriptions. Retrying malformed schema output can repeat an impossible contract. Bare empty values are often indistinguishable from verified no-findings outcomes.

## Proposed improvement
Negotiate the result channel before dispatch. Bind accepted channels, mandatory tools, schema/semantics, fallback and retry budget to a contract ID; preflight tool availability; validate the completion envelope; reject ambiguous empties and preserve partial failure evidence.

## Architecture
```text
subagent-output-channel-contract-guard/
├── README.md
├── evidence/research.md
├── config/output-contract-policy.json
├── skills/output-contract-negotiation.md
├── rules/output-channel-integrity.md
├── subagents/contract-verifier.md
├── workflows/negotiate-dispatch-verify.md
├── hooks/output-contract-preflight.md
└── scripts/output_contract_gate.py
```

## Installation
Python 3.10+; no third-party dependencies. Copy the package intact and adapt your orchestrator so it can expose child tool availability and result-channel metadata.

## Configuration
`config/output-contract-policy.json` controls allowed channels, explicit empty semantics, fallback requirements, retry budget and independent verification for high-impact review.

## Usage
Example contract:

```json
{
  "contract_id": "review-v1-7fd2",
  "accepted_channels": ["final_text", "structured_tool"],
  "required_tools": [],
  "empty_semantics": "verified_empty",
  "fallback_channel": "final_text"
}
```

Example tools:

```json
{"tools":["Read","Grep","ReportFindings"]}
```

Preflight:

`python scripts/output_contract_gate.py preflight contract.json --policy config/output-contract-policy.json --tools tools.json`

Example completion envelope:

```json
{
  "contract_id": "review-v1-7fd2",
  "channel": "final_text",
  "status": "verified_empty",
  "payload": [],
  "evidence": ["reviewed changed files", "verification pass completed"]
}
```

Verify:

`python scripts/output_contract_gate.py verify contract.json --policy config/output-contract-policy.json --result result.json`

## Workflow
Follow `workflows/negotiate-dispatch-verify.md`: define consumer need → negotiate contract → preflight → dispatch → collect raw envelope → verify → one bounded repair retry if safe → accept or fail visibly.

## Metrics
Contract-preflight coverage, channel mismatch rate, ambiguous-empty rate, usable child-result rate, retries/task, failed-child token cost, and verification coverage.

## Verification
**Implemented:** contract envelope and gate integrated. **Measured:** representative workloads report mismatch/empty/retry/token metrics. **Verified:** deterministic fixtures pass and downstream consumers accept only verified envelopes; high-impact review has independent verification.

## Safety
This package does not request hidden chain-of-thought. Preserve observable findings and tool/artifact evidence only. Do not redispatch non-idempotent work unless an independent idempotency boundary makes replay safe.

## Failure handling
Malformed, partial, unavailable-channel, or ambiguous-empty results fail closed as `contract_failure`/`partial`. At most one evidence-backed contract repair retry is allowed. Failure must remain visible to the parent.

## Definition of Done
Evidence documented; authoritative channel defined; tools attested; contradictions resolved; result correlated by contract ID; empty semantics unambiguous; retry limit enforced; metrics captured; independent verification applied where required; no blocking issue remains.

## Customization
Hosts may add channels such as message bus or durable artifact, but every channel must have explicit availability, correlation, completion, and fallback semantics before it is added to `allowed_channels`.
