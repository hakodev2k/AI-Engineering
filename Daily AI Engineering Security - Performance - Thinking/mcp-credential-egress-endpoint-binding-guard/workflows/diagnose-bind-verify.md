# Workflow: Diagnose, Bind and Verify Credential Egress
**Trigger:** new/changed credential-bearing tool, prompt-injection report, endpoint change, or security regression.  
**Goal:** prove that prompt-influenced arguments cannot redirect sensitive data to an unauthorized sink.

## Inputs
Tool schema, credential class, destination parameters, provider endpoint constraints, current policy, representative traces with secrets removed.
## Baseline
Record current allowed tools, destination validation behavior, approval behavior and attack-fixture results.
## Stages
1. **Observe** — identify sensitive sources and model-controlled sinks.
2. **Measure baseline** — run benign and hostile destination fixtures before changing policy.
3. **Diagnose** — find missing tool/destination/credential bindings.
4. **Form hypothesis** — state which deterministic constraint should block the observed attack path.
5. **Implement improvement** — add the narrowest binding or parser validation needed.
6. **Measure again** — rerun unit and attack fixtures.
7. **Improved?** — if no, revise at most twice; never weaken secret handling to make tests pass.
8. **Verify** — independent Security Verifier checks provider constraints and failure behavior.
9. **Complete** — enable the tool only when boundaries are verified.

## Responsible agent
Implementation owner changes policy/guard; `subagents/security-verifier.md` performs independent verification.
## Tools
Read-only schema/config inspection, deterministic guard, standard-library unit tests.
## Outputs
Baseline/results, binding policy, guard decision evidence, verification result.
## Checkpoints
Before policy change; after attack-fixture run; before enabling credential-bearing execution.
## Metrics
Unauthorized-destination block rate; benign allow rate; exception count; secret exposure count; verifier coverage.
## Retry policy
Maximum 2 implementation revisions.
## Stop conditions
Any secret exposure, ambiguous credential destination, parser bypass, or exhausted retries.
## Failure path
Disable the affected credential/tool binding or remove the credential from agent scope; escalate to a human security owner.
## Verification
Attack path blocked before outbound request construction; approved destination remains functional; no secrets exposed in logs/tests.
## Definition of Done
Implemented guard active; Measured baseline/post-change comparison complete; Verified tests and independent review pass; no blocking issue remains.
