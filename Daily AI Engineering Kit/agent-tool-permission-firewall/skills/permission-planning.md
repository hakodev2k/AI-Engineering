# Permission Planning Skill

## Purpose

Convert an intended agent tool action into a precise, auditable permission request before execution.

## When to use

Use before shell commands, file writes, Git mutations, database writes, cloud/API mutations, dependency changes, secret access, infrastructure actions, or production-affecting operations.

## Inputs

- user task;
- proposed tool/action;
- target resource;
- environment;
- expected side effects;
- repository policy.

## Preconditions

- the exact action is known;
- target and environment can be named;
- the agent has not executed the action yet.

## Process

1. State the smallest action needed.
2. Identify the tool and concrete command/request.
3. Identify target files, branches, services, databases, or endpoints.
4. Classify whether the action writes data.
5. Classify whether it touches secrets, permissions, infrastructure, production, or irreversible state.
6. Describe expected side effects.
7. Identify a safer read-only alternative if one exists.
8. Create an action-request JSON matching the template.
9. Run `scripts/check-policy.py`.
10. If decision is `deny`, stop.
11. If decision is `approval_required`, obtain explicit human approval for this exact action.
12. If decision is `allow`, execute only the requested scope.
13. Record the decision and result.

## Tools it may use

- repository search/read;
- read-only shell inspection;
- policy checker;
- audit writer.

## Constraints

- Do not broaden the action after approval.
- Do not split a denied command into smaller commands to bypass policy.
- Do not conceal destructive flags or side effects.
- Do not infer approval from a previous unrelated action.

## Expected output

A complete `action-request.json` with tool, action, target, reason, environment, and risk flags.

## Verification

Verify that the request exactly matches the command/tool invocation that will run.

## Failure handling

If intent or target is ambiguous, do not execute. Produce a narrower request or require human clarification/approval.

## Stop conditions

Stop when policy denies the action, approval is missing, the request cannot accurately describe the operation, or the actual command would exceed approved scope.
