# Skill: Technical Accuracy Verification

**Purpose:** ensure claims and procedures match supported system behavior.
**Trigger:** before review/publication and after material product change.
**Inputs:** draft, source map, code/specs, environment, tests, reviewer expertise.
**Preconditions:** supported version/environment identified.
**Steps:** extract material claims → map evidence → execute commands/examples where safe → compare expected/actual results → verify permissions and failure modes → flag unsupported claims → request focused SME review.
**Decisions:** stronger evidence overrides stale prose; unresolved contradictions block publication of affected guidance.
**Constraints:** destructive or security-sensitive verification requires approval and safe environment.
**Outputs:** verification record and corrected draft.
**Quality:** no unmarked unsupported claims; evidence traceability.
**Verification:** independent reviewer samples high-risk claims.
**Failure:** cannot verify after 2 bounded attempts → escalate with exact uncertainty.
**Stop:** claim set meets required confidence or excluded content is explicitly documented.