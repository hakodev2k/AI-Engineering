# Head-Branch Review Context Poisoning Guard

**Category:** Security  
**Run date:** 2026-08-21 (UTC+7)

## Problem
AI code review can ingest branch-controlled custom instructions, agent skills, and persuasive PR metadata. When the branch under review can also influence reviewer behavior, review policy and evidence-under-review lose a clean trust boundary.

## Evidence
See `evidence/research.md`. GitHub's July 17, 2026 change makes code review read instruction/skill files from the PR head branch. Independent 2026 research demonstrates large confirmation-bias effects in LLM security review and successful adversarial PR framing.

## Existing approach and limitations
Built-in human review, CodeQL, secret/dependency scanning, and model instructions are useful layers. However, model-only debiasing is probabilistic, disabling all repository guidance loses useful context, and many workflows do not explicitly detect a PR changing the same files that guide its AI reviewer.

## Proposed improvement
Anchor trusted review policy to the base ref; classify changed head-branch instructions/skills as supplemental-untrusted; quarantine persuasive metadata for the first security pass; require explicit approval for reviewer-context changes; and require independent static/test evidence before a security-safe conclusion.

## Architecture
- `skills/review-trust-audit.md` — provenance and trust-boundary procedure.
- `rules/review-context-rules.md` — enforceable review constraints.
- `subagents/security-review-verifier.md` — independent verifier role.
- `workflows/review-context-sanitize-and-verify.md` — bounded baseline/supplemental/verification flow.
- `hooks/pre-review-context-gate.md` — deterministic pre-review gate.
- `scripts/review_context_guard.py` — changed-path/evidence validator.
- `tests/test_review_context_guard.py` — adversarial trust-boundary regression tests.
- `config/policy.json` — review-context path patterns and evidence requirements.
- `evidence/research.md` — current public evidence and interpretation.

## Installation
Requires Python 3.10+. Tests use `pytest`.

```bash
python scripts/review_context_guard.py review-input.json --policy config/policy.json
python -m pytest tests/test_review_context_guard.py
```

## Configuration
Extend `trusted_instruction_patterns` for local reviewer configuration/skill paths. Keep explicit approval enabled for head-branch reviewer-context changes in sensitive repositories. Integrate mandatory security evidence identifiers with your CodeQL/SAST/test pipeline.

## Usage
Before AI review, enumerate changed paths from explicit base/head refs. Feed them to the guard together with approval state and independently produced security evidence. Use the base branch's review policy for the first pass. Treat head-branch instructions as labeled supplemental context only after baseline findings are recorded.

## Workflow
Observe → detect reviewer-context changes → establish trusted base policy → quarantine persuasive metadata → baseline security review → optionally expose approved/labeled supplemental guidance → compare findings → independent verifier checks scans/tests/provenance → complete or escalate.

## Metrics
Track reviewer-context change detection, independent evidence coverage, unapproved policy promotions, baseline-vs-supplemental suppressed findings, adversarial fixture detection, and false-negative regression rate.

## Verification
**Implemented:** deterministic path/evidence guard, policy, audit skill, independent verifier, workflow, hook, tests.  
**Measured:** consuming repository should record gate decisions and baseline/supplemental finding deltas.  
**Verified:** branch-controlled instructions cannot override base security policy; mandatory independent evidence is present; regression fixtures pass; high-risk conflicts receive human review.

## Safety
Do not execute untrusted PR code with privileged credentials to determine whether it is trustworthy. Keep secrets, write permissions, merge permissions, and production access outside branch-controlled reviewer context. This package complements rather than replaces CodeQL, secret scanning, dependency scanning, branch protection, sandboxing, and human approval.

## Failure handling
Invalid inputs return exit 2. Missing evidence or unapproved instruction changes return exit 3. Review retries are bounded to the configured maximum (default 2). If provenance/evidence remains unresolved, the final status is incomplete/review-required, not safe.

## Definition of Done
- Current public evidence documented.
- Base/head refs and changed paths established.
- Every changed reviewer-context file detected.
- Head-branch policy changes quarantined or explicitly approved.
- Independent security evidence collected.
- Baseline findings preserved before supplemental framing.
- Conflicts resolved by independent verifier/human where required.
- Tests pass and no secrets or dangerous permissions were exposed.

## Customization
Add organization-specific instruction paths, mandatory scan types, review-risk levels, or protected-file patterns. Preserve the base-vs-head provenance boundary and independent-evidence requirement.