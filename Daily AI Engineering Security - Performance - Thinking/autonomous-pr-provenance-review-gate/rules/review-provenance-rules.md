# Rules — Review Provenance and Merge Safety

- Merge decisions MUST use observable repository evidence, not guesses about real-world identity.
- The PR/change author MUST NOT count as an independent approving reviewer.
- Comments, reactions, and repeated arguments MUST NOT count as approvals unless the repository review API records them as approving reviews.
- Sensitive-path changes MUST receive the stricter policy defined in `config/policy.json`.
- Required status checks MUST pass before `allow`.
- When configured, sensitive changes MUST contain verified signed commits.
- When configured, sensitive changes MUST have Code Owner review.
- When configured, at least one independent approval MUST occur after the latest material push.
- Stale approvals MUST NOT satisfy latest-push approval requirements.
- Agent-authored work SHOULD retain platform-provided attribution/session references when available.
- Missing provenance MUST be represented as `unknown`; it MUST NOT be converted into a maliciousness claim or a pass.
- Unknown provenance SHOULD result in `additional_review_required` when blocking controls otherwise pass.
- Security requirements MUST NOT be weakened merely because a contributor or automation is trusted by reputation.
- A high-risk change MUST NOT be verified solely by the agent or actor that implemented it.
- Metadata retry loops MUST be bounded to one refresh plus one fallback fetch before escalation.