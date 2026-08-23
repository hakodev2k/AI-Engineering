# Tool Call Safety Rules

## MUST

- Serialize every agent-proposed tool invocation into the request contract before invoking the real tool.
- Evaluate the request with `scripts/gate_tool_call.py` and the reviewed policy.
- Treat only exit code `0` plus decision status `allow` as authorization to execute.
- Bind approvals to the exact `request_id` and matched `rule_id`; reject expired approvals.
- Preserve gate decisions with downstream execution evidence.
- Keep production IAM, filesystem permissions, database permissions, and sandbox controls enabled; the gate is an additional boundary, not a replacement.
- Re-run the gate if tool name, operation, arguments, policy, or security-relevant context changes after approval.
- Require independent verification after mutations that affect code, configuration, dependencies, data, deployment, or infrastructure.

## MUST NOT

- Execute after `deny`, `approval_required`, `invalid`, or `error`.
- Let an LLM reinterpret, suppress, or override a deterministic denial.
- Treat an approval for one request or rule as approval for another.
- Add broad `allow` rules such as shell `*` merely to unblock a task.
- Store secrets, tokens, passwords, private keys, or production credentials in request examples, policy files, or approval records.
- Force push, rewrite Git history, perform destructive SQL, delete production resources, weaken security controls, or make irreversible migrations without an external explicit human process; supplied hard-deny patterns remain non-overridable by this package.
- Fail open when policy parsing or gate execution fails.

## SHOULD

- Prefer narrow tool-native read/write operations over arbitrary shell commands.
- Scope rules by the smallest practical tool and operation patterns.
- Give policy exceptions an owner, rationale, tests, and expiration/review date in the surrounding repository process.
- Run `python scripts/verify_package.py` after policy or gate changes.
- Keep high-risk implementation and verification ownership separate.