# Senior Decision and Evidence Rules
## Purpose
Require Senior mobile engineering decisions to be explicit, evidence-based, and proportionate to risk.
## Scope
Architecture, performance, security, compatibility, dependency, rollout, and production decisions.
## MUST
- Significant decisions MUST state constraints, alternatives considered, trade-offs, risks, and verification evidence.
- Claims about performance, battery, compatibility, security, or production behavior MUST use measurements, tests, platform documentation, telemetry, or equivalent evidence.
- Decisions with irreversible user-data, privacy, financial, or security impact MUST identify required human approval before execution.
## MUST NOT
- Agent confidence, convention, or anecdote MUST NOT be treated as sufficient evidence for high-impact claims.
- Reversible analysis/recommendation authority MUST NOT be silently expanded into production execution authority.
## SHOULD
- Prefer reversible designs and small validated increments when uncertainty is high.
## Exceptions
Low-impact local choices may rely on established project conventions when no material risk or trade-off exists.
## Verification
Review decision records, benchmark/test artifacts, risk notes, approval evidence, and post-release outcomes.