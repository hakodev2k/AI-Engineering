# Rules — Approval Evidence Integrity

1. An approval surface MUST identify the concrete action or tool being authorized.
2. An approval surface MUST identify the concrete target or resource affected.
3. An affirmative approval option MUST NOT be rendered unless the requested permission or mutation scope is visible and non-empty.
4. A security hook or reviewer rationale MUST be preserved through transport and shown to the decision-maker when that rationale caused or materially informed the approval request.
5. A human-gated request MUST NOT be considered approved unless the approval was actually rendered on an actionable human surface.
6. A generic status such as `approval waiting`, `approved`, or `denied` MUST NOT substitute for action, target, scope, or rationale evidence.
7. Cross-device and cross-client approval surfaces MUST preserve the same request identity and decision subject.
8. Audit records MUST preserve the action, target, scope, rationale, decision, reviewer type, and request ID used at decision time.
9. Any producer→UI or UI→audit mismatch MUST block a `Verified` status until resolved.
10. Missing decision evidence MUST fail closed; implementations MUST NOT infer absent values from stale conversation context.
11. Automated reviewers SHOULD expose rationale and risk metadata sufficient to audit unexpected approvals or denials.
12. High-risk approval changes MUST be verified by someone or something other than the implementing agent.
