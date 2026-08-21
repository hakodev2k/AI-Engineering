# Repository Working-Set Coherence Guard

**Category:** Token  
**Run date:** 2026-08-21 (UTC+7)

## Problem
Repository-scale coding agents can spend heavily on exploration and context reconstruction while still missing edit-critical facts. Broad context files can add cost and stale requirements; aggressive compression can remove operational details. The package treats context as a dependency-managed working set rather than a passive transcript.

## Evidence
See `evidence/research.md`. Current signals include the Aug 17, 2026 coherence-debt study, Microsoft FastContext, the AGENTS.md evaluation, and recent rendered-code compression research.

## Existing approach and limitations
Common approaches load broad repository instructions, keep exploration in the solver history, summarize after context growth, or compress source. These can reduce some costs but do not deterministically prove that the facts required by an edit are fresh and present.

## Proposed improvement
Build an explicit required-fact manifest per edit, attach repository provenance/hash/freshness, remove duplicate exploration first, block edits when required coverage is incomplete, and evaluate token savings together with correctness.

## Architecture
- `skills/working-set-audit.md` — evidence-driven working-set construction.
- `rules/context-coherence-rules.md` — enforceable context invariants.
- `subagents/context-curator.md` — non-writing localization/curation role.
- `workflows/measure-optimize-verify.md` — bounded measure/diagnose/optimize/verify loop.
- `hooks/pre-edit-working-set-check.md` — deterministic pre-edit gate.
- `scripts/working_set_guard.py` — manifest validator with meaningful exit codes.
- `tests/test_working_set_guard.py` — allow/missing/stale/duplicate regression tests.
- `config/policy.json` — thresholds.
- `evidence/research.md` — current research and interpretation.

## Installation
Requires Python 3.10+ for the guard. Tests use `pytest`.

```bash
python scripts/working_set_guard.py manifest.json --policy config/policy.json
python -m pytest tests/test_working_set_guard.py
```

## Configuration
Tune `max_context_bytes`, `max_duplicate_ratio`, and refresh retry limits for your model/harness. Keep `min_required_fact_coverage` at `1.0` for correctness-sensitive edits unless you have a formally justified alternative.

## Usage
Create a `manifest.json` containing current context size, segment hashes/bytes, and facts with `required`, `present`, `fresh`, `source`, and `sha256`. Run the hook before material edits and after repository changes that can invalidate dependencies.

## Workflow
Observe → measure baseline → map edit dependencies → diagnose missing/stale/duplicate context → perform one bounded context optimization → measure again → edit only on `allow` → run mapped tests → independent verification.

## Metrics
Track input tokens/task, context bytes, duplicate ratio, required-fact coverage, repeated repository reads, task success, and regression-test pass rate.

## Verification
**Implemented:** manifest guard, policy, curator role, workflow, hook, and regression tests exist.  
**Measured:** a real integration must record before/after context and token metrics.  
**Verified:** completion requires 100% required-fact coverage plus project tests/static checks passing with no quality regression.

## Safety
The guard never recommends dropping correctness-critical context to hit a token target. Repository memory is not accepted as a replacement for current evidence when current evidence is available.

## Failure handling
Detection is deterministic through exit codes and findings. Refresh retries are bounded by policy (default 2). If required facts remain unresolved, stop and surface the exact missing/stale set rather than guessing.

## Definition of Done
- Current evidence documented.
- Baseline context/token metrics captured in the consuming project.
- Every planned edit maps to required repository facts.
- Required-fact coverage meets policy before editing.
- Token/duplication metrics are measured after optimization.
- Tests and acceptance checks pass.
- No quality regression is accepted merely for lower token use.
- Independent verification confirms manifest-to-edit consistency.

## Customization
Extend manifest facts with dependency types, test IDs, schema versions, retrieval references, or tokenizer-specific estimates. Keep provenance/freshness checks and bounded retries intact.