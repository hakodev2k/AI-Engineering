# MCP Tool Annotation Approval Integrity Guard

Category: **Security**

## Problem
Approval systems increasingly use MCP tool annotations such as `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`, but adapters can drop or misread them while translating protocol JSON into SDK objects or approval context. The result is either excessive approval prompts or, more dangerously, incorrect trust classification.

## Evidence
See `evidence/research.md` for current public signals from Hermes Agent and Vercel Eve.

## Proposed improvement
Treat annotation transport as a security invariant. Normalize protocol and SDK field names, preserve provenance, validate semantic combinations, and refuse risk downgrades when annotations are absent, malformed, or changed after discovery.

## Architecture
- `scripts/annotation_guard.py` — deterministic normalizer and classifier.
- `skills/annotation-integrity-review.md` — reusable investigation procedure.
- `rules/approval-annotation-rules.md` — enforceable policy.
- `subagents/security-reviewer.md` — independent reviewer contract.
- `workflows/discovery-to-approval.md` — bounded end-to-end flow.
- `hooks/pre-approval-validation.md` — blocking validation hook.
- `tests/test_annotation_guard.py` — executable regression tests.

## Usage
Run `python scripts/annotation_guard.py tool.json`; exit 0 means the tool metadata was parsed and classified, exit 2 means malformed input. Run `python -m unittest tests/test_annotation_guard.py` for verification.

## Metrics
Track annotation preservation rate, unknown-risk rate, false approval rate, risky-tool underclassification count, and annotation drift after refresh.

## Safety
Annotations are advisory server claims, not authorization. Missing or contradictory annotations MUST NOT reduce required approval. Identity, policy, scopes, sandboxing and user approval remain independent controls.

## Definition of Done
Evidence documented; live and serialized shapes covered; normalizer implemented; malformed/contradictory cases tested; no missing annotation can downgrade risk; reviewer independent from implementer; all paths referenced here exist.