# Blockchain Incident Response

## Purpose
Investigate and contain blockchain incidents while preserving evidence, protecting assets, coordinating privileged actions, and accounting for irreversible/public chain effects.

## When to use
Use for exploits, suspected key compromise, abnormal asset movement, oracle failure, bridge issues, stuck protocol states, deployment mistakes, or critical production regressions.

## Inputs
Incident description, affected contracts/chains, transaction hashes, logs, traces, monitoring alerts, governance controls, key/custody model, current asset exposure.

## Preconditions
Incident authority and emergency controls are known; responders avoid speculative irreversible actions without evidence.

## Context to inspect
Recent transactions, call traces, contract state, admin events, wallet activity, oracle/bridge status, RPC/indexer health, deployments, code changes, and known attack paths.

## Core knowledge
Blockchain evidence is public and durable, but current state can change rapidly. Response must distinguish chain consensus facts from off-chain service symptoms. Front-running and attacker observation make public remediation plans risky.

## Procedure
1. Establish incident severity, affected assets, chains, and time window.
2. Preserve transaction hashes, block numbers/hashes, traces, logs, and relevant off-chain evidence.
3. Determine whether the issue is on-chain logic, compromised authority, external dependency, provider/indexing error, or user-interface/backend behavior.
4. Quantify current value at risk and ongoing exploitability.
5. Apply the smallest pre-authorized containment action: pause, rate-limit, disable relayer, revoke role, isolate signer, or block affected integration.
6. Verify containment on-chain and through independent RPC/provider views.
7. Reconstruct the exploit/failure path and violated invariant.
8. Design remediation with explicit migration/upgrade and governance implications.
9. Test remediation on a fork reproducing the incident state.
10. Execute approved recovery and reconcile assets/state afterward.
11. Add regression tests, monitoring, and control changes tied to root cause.
12. Produce a factual timeline and residual-risk assessment.

## Decision points
Pause only when the protocol supports it safely and the expected loss from continued operation exceeds pause impact. Rotate keys immediately when compromise is credible, but preserve enough evidence for investigation.

## Common failure patterns
Reacting to indexer artifacts as chain truth, publishing remediation before containment, upgrading without fork reproduction, destroying forensic evidence, and declaring success before state/asset reconciliation.

## Verification
Containment is verified by direct chain state and transaction evidence; remediation is verified by replaying the original failure plus regression/invariant tests and post-recovery reconciliation.

## Expected output
Incident timeline, evidence set, containment record, root cause, verified remediation, asset/state reconciliation, and prevention actions.

## Stop conditions
Escalate immediately when required emergency authority is unavailable, legal/compliance involvement is required, or remediation risks further irreversible asset loss.