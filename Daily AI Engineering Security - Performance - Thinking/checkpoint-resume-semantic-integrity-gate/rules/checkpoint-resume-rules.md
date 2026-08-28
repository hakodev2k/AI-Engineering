# Rules: Checkpoint Resume Integrity

- A resume MUST identify the exact restored checkpoint and the first checkpoint created after resume.
- The first post-resume checkpoint MUST link to the restored checkpoint unless the framework documents an equivalent auditable lineage mechanism.
- Workflow topology and stable executor identities MUST be compatible with the checkpoint producer.
- A successful checkpoint deserialization MUST NOT be treated as proof of correct semantic resume.
- Pending and answered request/approval IDs MUST be reconciled before consequential work resumes.
- An already-answered request MUST NOT reappear as pending without a new explicit request identity.
- Iteration/superstep progress MUST NOT silently roll backward after resume.
- Any ambiguity involving approvals, external writes, deploys, payments, credentials or destructive actions MUST block execution and require human review.
- Resume verification SHOULD include process/compute recreation, not only same-process restoration.
- Corrective loops MUST be bounded to at most 2 attempts before escalation.
- Verification MUST be performed by an agent/reviewer other than the sole implementer for high-risk workflows.
