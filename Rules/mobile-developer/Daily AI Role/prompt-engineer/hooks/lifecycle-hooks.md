# Lifecycle Hooks
## pre-design
Reject work lacking objective, intended user, material constraints, or expected output. Record missing fields instead of guessing.
## pre-evaluation
Validate prompt spec structure and freeze candidate version so results are attributable.
## pre-release
Require critical cases passing, reviewer disposition, version record, and rollback target.
## post-failure
Create a failure-learning record for any material escaped defect and add a regression case before closing.
Hooks MUST be deterministic, idempotent where possible, and MUST NOT mutate production systems or secrets.
