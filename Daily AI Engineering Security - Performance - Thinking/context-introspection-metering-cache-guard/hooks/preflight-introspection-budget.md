# Hook: Introspection Budget Preflight

## Trigger
Before enabling or invoking repeated context/token introspection in a turn/session, and after tool/skill/model configuration changes.

## Preconditions
A recent auxiliary-call trace exists and provider/model identity is known.

## Action
Analyze the trace against deployment-specific request/token budgets and inspect repeated uncached fingerprints.

## Script/command
`python scripts/introspection_analyzer.py "$TRACE" --max-requests-per-turn "$MAX_REQ" --max-input-tokens-per-turn "$MAX_TOKENS"`

## Expected result
Exit `0`, no budget breaches, and no unexplained repeated uncached fingerprint for stable context definitions.

## Failure behavior
- Exit `3`: stop additional non-essential introspection for the turn, retain last-known-good safe context measurement where applicable, and trigger optimization/reconciliation workflow.
- Exit `4`: mark measurement invalid and block any claim that overhead is within budget.

## Blocks completion
Yes when the package is being used to claim token/cost optimization. Runtime product behavior may continue using correctness-safe fallback measurements rather than disabling required context limits.

## Safety
This hook controls auxiliary measurement work only. It MUST NOT remove required model instructions, security context, or context-window safeguards.