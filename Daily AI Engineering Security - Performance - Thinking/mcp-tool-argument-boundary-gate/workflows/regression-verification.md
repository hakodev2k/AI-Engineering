# Workflow: Security Regression Verification

## Trigger
Tool implementation, schema, policy, dependency, root, or credential-destination change.

## Goal
Prove previously known argument attacks stay blocked.

## Inputs
Policy, guard, source diff, adversarial fixtures.

## Baseline
Known benign calls plus command-injection, endpoint-redirection, proxy, traversal, and symlink-escape cases.

## Stages
1. Run unit tests.
2. Verify unknown tools fail closed.
3. Verify shell metacharacter fixture is denied.
4. Verify unapproved host or proxy is denied.
5. Verify lexical in-root but canonical out-of-root path is denied.
6. Verify benign allowed calls still work.
7. Review logs for secret-free output.

## Retry policy
Maximum 2 implementation corrections.

## Stop conditions
Any attack fixture succeeds, any secret appears, or policy is weakened to pass tests.

## Failure path
Keep the tool disabled and escalate.

## Verification
Security Verifier must be separate from the implementer.

## Definition of Done
All tests pass, sink coverage is complete, security boundaries are preserved, and no blocking issue remains.
