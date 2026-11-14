# Controlled change workflow
Trigger: AI-assisted code change requested.
Entry: User task, checkout, approved policy, clean baseline.
Flow: owner captures SHA → explorer locates relevant code → owner plans → approval gate → implementer edits → deterministic guard → tests → independent verifier → owner reports.
Artifacts: `artifacts/scope-report.json`, test command transcript, final diff summary.
Checkpoints: Before edit (path approval); before commit/push (human authorization); after verification.
Retries: At most 2 edits for test/guard failures, retaining previous failure reports. Tool/environment failure: one retry after correction. Permission denial: zero retries.
Stop: Unapproved sensitive action, unexpected dirty baseline, third failure, or unavailable test environment.
Recovery: Preserve patch and logs, mark BLOCKED, request targeted decision. Never widen policy automatically.
Definition of Done: Guard exit 0, relevant tests pass, reviewer PASS, no unapproved changes, risks documented.
