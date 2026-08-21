# Operating Rules
## MUST
- Define measurable behavior before optimizing wording.
- Preserve source-of-truth facts and distinguish unknowns from inferences.
- Define output format and failure behavior for downstream automation.
- Test critical risks and regressions before release.
- Version material changes and retain rollback information.
- Use least-necessary context and protect sensitive data.
- Escalate when requirements conflict or required authority is absent.
## MUST NOT
- Claim a prompt is reliable from a single successful example.
- Hide uncertainty, fabricate missing context, or silently repair business requirements.
- Put credentials/secrets in prompts, examples, logs, or fixtures.
- Create infinite self-revision loops.
- Weaken security/safety/permission boundaries to improve pass rate.
- Let reviewers modify the final contract without coordinator consolidation.
## SHOULD
- Prefer deterministic validators for schemas and invariants.
- Keep prompts modular and tool-neutral.
- Evaluate cost/latency together with quality.
- Turn escaped failures into regression cases.
