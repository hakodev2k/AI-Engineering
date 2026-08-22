# Tool Evidence Claim Provenance Gate

**Category:** Thinking

## Problem
Agents can accidentally describe an intended, failed, inferred, or unavailable external action as a completed observation: “I opened it,” “I found that chat,” “I see it,” or “I’m monitoring it.” This undermines investigation and decision reliability even when tool logs exist elsewhere.

## Evidence
See `evidence/research.md`. Two independent 2026-08-19 reports cover cross-chat retrieval and Voice/live-access claims without supporting retrieval/tool evidence.

## Existing approach / limitations
Truthfulness prompts, uncertainty guidance, citations, and tool logs are useful but do not mechanically bind final access claims to successful current evidence.

## Proposed improvement
Represent externally grounded claims and successful tool/backend observations as a compact machine-readable contract. Require evidence IDs for retrieved/live claims, enforce source identity and freshness, distinguish attempts/inference from observations, and block unsupported completion language.

## Architecture
- `skills/claim-evidence-binding.md`
- `rules/claim-provenance-rules.md`
- `subagents/provenance-verifier.md`
- `workflows/bind-correct-verify.md`
- `hooks/pre-final-claim-gate.md`
- `scripts/claim_provenance_gate.py`
- `evidence/research.md`

## Installation
Python 3.9+. No third-party dependencies. The runtime should create an evidence ledger from actual tool/backend results and a structured claim list before final output.

## Configuration
Claims use `id`, `kind` (`knowledge`, `user-provided`, `retrieved`, `live`, `attempted`, `inferred`), optional `source_type`, and `evidence_ids`. Evidence entries use `id`, `success`, `source_type`, `timestamp`, and source reference/metadata. Configure a freshness window appropriate to the meaning of “live/current”.

## Usage
`python3 scripts/claim_provenance_gate.py claims.json evidence-ledger.json --max-live-age-sec 300`

Exit 0 = PASS, 2 = invalid/unverifiable input, 3 = BLOCK.

## Workflow
Observe claims → bind evidence → diagnose missing/failed/stale/mismatched sources → one correction or authorized retrieval attempt → measure again → deterministic gate → independent verification.

## Metrics
Unsupported-claim rate, evidence coverage, stale-live claims, false completion-language count, retrieval-failure honesty rate, correction/rework rate.

## Verification
Run the gate using only structured claims and runtime evidence. The independent Provenance Verifier must reach the same result without hidden chain-of-thought. Regression cases should include successful retrieval, empty retrieval, failed tool call, wrong source type, stale live evidence, and inference explicitly labeled as inference.

## Safety
Do not invent evidence. Do not turn user-provided content into an independently retrieved claim. Do not reveal private source content beyond authorization. This package improves observable reasoning reliability and never requests hidden chain-of-thought.

## Failure handling
Detection: deterministic gate. Evidence: missing/stale/mismatched IDs. Retry: one correction/retrieval attempt maximum. Fallback: clearly state source unavailable or label the statement as inference if appropriate. Escalation: runtime/tool integration owner. Stop when ledger is unavailable or the second draft remains unsupported.

## Implemented / Measured / Verified
Implemented = claim/evidence contract integrated. Measured = coverage/error metrics collected. Verified = regression cases and independent verifier pass with unsupported completion claims blocked.

## Definition of Done
Evidence documented; claim baseline measured; source-state distinctions implemented; deterministic gate passes; live claims are fresh; failed retrieval is represented honestly; regression checks pass; independent verification complete; no unsupported external-access claim remains.

## Customization
Add source-specific validators for private chat, files, browser state, databases, or voice runtime. Keep source identity, success state, freshness, and evidence-ID integrity observable and deterministic.