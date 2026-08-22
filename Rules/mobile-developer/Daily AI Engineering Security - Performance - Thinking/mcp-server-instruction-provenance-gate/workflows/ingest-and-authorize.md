# Workflow — Ingest and Authorize MCP Instructions

## Trigger
A server supplies or changes instructions/metadata, or an agent is about to execute a tool influenced by that content.

## Goal
Preserve useful server metadata without granting it implicit high-impact authority.

## Inputs
Server ID, raw instructions, prior hash, requested capabilities, trust policy, optional approval.

## Baseline
Before rollout, record current behavior for the fixtures in `tests/cases.json`: which malicious/stale-approval cases currently reach high-impact execution and whether provenance survives to the action boundary.

## Context
Server text is data from a separate trust domain. Authorization is based on explicit policy and the user's goal, not on instructions contained in that text.

## Stages
1. Observe: capture source, raw byte length, existing trust state, previous hash, and requested capability.
2. Measure baseline: run the fixture suite against current integration behavior.
3. Diagnose: identify where provenance or action-time policy is lost.
4. Form hypothesis: define the smallest gate placement expected to block the observed path.
5. Implement: integrate `scripts/instruction_gate.py` or equivalent deterministic logic before high-impact execution.
6. Measure again: rerun all fixtures and capture decisions/exit codes.
7. Independent verify: hand results to `subagents/security-verifier.md`.
8. Complete only when attack fixtures are blocked/approval-gated and benign fixtures remain usable.

## Responsible agent
Implementation owner for stages 1–6; Security Verifier for stage 7.

## Tools
Local Python 3, policy JSON, hashes, application logs, and non-production test MCP fixtures.

## Outputs
Baseline report, provenance records, decisions, test evidence, residual-risk note.

## Checkpoints
- After baseline: confirm a reproducible security boundary exists.
- Before implementation: confirm capability mapping and trust assumptions.
- Before verification: confirm no policy weakening occurred.

## Metrics
Provenance coverage, high-impact gate coverage, malicious-fixture block rate, benign pass rate, stale-approval rejection rate.

## Retry policy
At most 2 implementation iterations after the first measured attempt. Each retry MUST cite a new finding or failed fixture.

## Stop conditions
Stop and escalate after 3 total measured implementations, on ambiguous high-impact classification, or when required provenance cannot be obtained.

## Failure path
Fail closed for high-impact operations, preserve evidence, and request a human security decision. Never bypass the gate to restore functionality.

## Verification
Run `python3 scripts/test_instruction_gate.py` from the topic directory and obtain independent review.

## Definition of Done
Evidence documented; baseline captured; gate implemented; fixture suite passes; high-impact boundaries preserved; residual risks recorded; independent verification completed; no blocking issue remains.
