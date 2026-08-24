# PowerShell Automation

## Purpose
Ensure administrative automation is deterministic, reviewable, safe, and supportable.

## Scope
PowerShell scripts, modules, remoting, scheduled automation, and administrative tooling.

## MUST
- Automation MUST validate inputs, surface failures, and return meaningful exit or error state.
- Destructive operations MUST support preview/dry-run where practical and require explicit authorization before production execution.
- Scripts changing many systems MUST bound concurrency, retries, timeouts, and failure handling.
- Credentials MUST come from approved secret or identity mechanisms rather than source text.
- Material automation MUST be version-controlled and peer reviewed.

## MUST NOT
- MUST NOT suppress unexpected errors to produce apparent success.
- MUST NOT invoke downloaded or dynamically constructed code without trust validation.
- MUST NOT use unrestricted remoting endpoints when constrained administration can meet the need.

## SHOULD
- Prefer idempotent operations and structured output.
- Log target, action, result, correlation identifier, and non-sensitive diagnostics.

## Exceptions
Document necessity, affected systems, safeguards, verification, and approval.

## Verification
Run static analysis, tests, code review, non-production execution, permission inspection, and sampled post-run state checks.