# Workflow: Tool Output Taint Gate

## Trigger
A feature or agent consumes externally controlled content and can subsequently invoke tools, write files/data, execute commands, access secrets, or deploy.

## Entry conditions
Trusted task specification exists; repository is readable; external sources and candidate sinks can be identified.

## Inputs
Task, diff/repository, tool contracts, external-content samples, `config/policy.json`.

## Flow
`Trigger → Map sources → Trace sinks → Plan boundary → Implement containment → Test → Independent verify → Approval if required → Complete`

## Stages
1. **Context — Taint Investigator:** inspect only relevant structure, entry points, context builders, tool adapters, tests. Produce evidenced paths.
2. **Plan — Coordinator:** select smallest boundary change; define acceptance checks. No write if evidence is insufficient.
3. **Execute — Implementation owner:** follow `skills/contain-and-sanitize.md`; preserve provenance and trusted/untrusted separation.
4. **Hook — Implementation owner:** run `hooks/pre-sensitive-action.md` for representative external payloads.
5. **Test:** run `python3 -m unittest tests/test-scan-taint.py` plus repository-native affected tests/build.
6. **Verify — Independent Verifier:** re-trace paths, inspect diff, confirm sink arguments are trusted, record status.
7. **Approval:** stop before any sink listed in `approval_sinks`; proceed only with explicit human approval.

## Produced artifacts
Code/config changes in adopting repository, test evidence, scanner JSON evidence, verification status and residual-risk notes.

## Checkpoints
After trace: every high/critical path has evidence. After implementation: malicious fixture blocked and benign fixture passes. Before completion: verifier reports `pass` and required approvals exist.

## Retry rules
Transient tool/test infrastructure failures: maximum 2 retries, preserving stdout/stderr. Validation/security findings: 0 blind retries; change implementation/input. Permission failures: 0 retries unless permission is granted by a human. After retry exhaustion: `failed` and escalate.

## Failure paths
Unknown data path → `blocked`; scanner failure → `failed`; dangerous action awaiting approval → `needs-approval`; unresolved high/critical finding → `blocked`.

## Stop conditions
Permission escalation, destructive action, security weakening, missing critical context, retry exhaustion, or unresolved high/critical path.

## Definition of Done
All relevant external paths traced; containment implemented; scanner fixtures and affected tests pass; no unintended permission expansion; independent verification passes; approvals obtained where required; residual risks documented.
