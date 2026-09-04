# Production Safety and Approval Rules

## Purpose
Prevent browser automation from silently exceeding its authority when interacting with production systems or high-impact workflows.

## Scope
Applies to automation capable of changing production data, accounts, access, configuration, financial state, public content, or external systems.

## MUST
- Automation MUST distinguish analysis, recommendation, preparation, dry-run validation, and execution as separate authority levels.
- Any production action that can delete data, change privileges, publish content, submit irreversible transactions, alter configuration, rotate secrets, or trigger material external effects MUST require explicit human approval unless a separately approved operating policy authorizes that exact action.
- Production workflows MUST define target verification, blast-radius limits, abort conditions, and post-action verification before execution.
- The active environment, identity, target, and intended mutation MUST be verified immediately before a high-risk browser action.
- Audit evidence MUST record the approved action and observed result without exposing secrets.

## MUST NOT
- Automation MUST NOT infer approval from a successful login, available UI control, prior unrelated approval, or model confidence.
- Force-click, DOM scripting, or security bypasses MUST NOT be used to defeat confirmation or authorization controls.
- Destructive production actions MUST NOT be retried automatically unless idempotency and retry authority are explicitly established.
- Automation MUST NOT continue when the observed target or state differs materially from the approved plan.

## SHOULD
- High-risk workflows SHOULD support dry-run or non-production rehearsal.
- Reversible, bounded actions SHOULD be preferred when they achieve the same objective.

## Exceptions
Emergency procedures require the designated emergency authority, documented reason, bounded scope, and retrospective evidence review. An AI agent may prepare steps but MUST NOT manufacture authorization.

## Verification
Review approval records, target checks, environment guards, audit logs, retry policy, and rollback or abort procedures. Test safety gates using non-production simulations and confirm missing or mismatched approval blocks execution.