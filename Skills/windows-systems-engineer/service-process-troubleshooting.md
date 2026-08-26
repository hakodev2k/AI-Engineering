# Service and Process Troubleshooting

## Purpose
Diagnose Windows service and process failures from lifecycle, dependency, identity, resource, and application evidence.

## When to use
Use for services that fail to start, crash, hang, restart, leak resources, or behave differently under service identities.

## Inputs
Service/process name, symptom, timestamps, dependencies, service account, configuration, recent changes, logs, and dump/trace availability.

## Preconditions
Understand workload criticality before stopping processes or changing service recovery behavior.

## Context to inspect
Service Control Manager state/events, executable path, startup type, dependencies, account/logon rights, environment/configuration, process tree, handles, threads, resource use, crash events, Windows Error Reporting, and application logs.

## Core knowledge
A service failure may originate before process creation, during authentication/configuration, at dependency startup, or inside the process. SCM timeout is a symptom, not necessarily root cause. Recovery actions can amplify crash loops.

## Procedure
1. Capture exact service state and first failure timestamp.
2. Inspect SCM and application events around the transition.
3. Validate executable path, configuration, identity, and dependencies.
4. Test access to required files, registry, network, certificates, and secrets under the service identity.
5. For crashes, collect appropriate dump/WER evidence.
6. For hangs, inspect threads/waits and external dependencies.
7. Compare with a healthy instance or prior configuration.
8. Correct the narrowest cause.
9. Restart in a controlled manner and observe stability.
10. Review recovery actions and monitoring thresholds.

## Decision points
Use dumps/traces when logs cannot explain crash or hang behavior. Change service identity only when the authorization model requires it, not as a diagnostic shortcut.

## Common failure patterns
Repeated restarts that erase evidence, running as LocalSystem to bypass permissions, ignoring dependencies, changing recovery to infinite restart, and blaming SCM timeout without examining the process.

## Verification
Verify stable service state, successful dependency interactions, expected identity, normal resource use, clean logs, and workload health over time.

## Expected output
A causal diagnosis and stable service configuration.

## Stop conditions
Stop if dump collection may expose sensitive data without approval, restart threatens availability, or the fault lies in application code requiring the owning team.