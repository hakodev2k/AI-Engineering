# Remote Management and WinRM

## Purpose
Engineer secure, reliable remote Windows administration using WinRM, PowerShell remoting, and controlled management paths.

## When to use
Use for fleet automation, remote diagnosis, remoting failures, JEA design, or management-plane hardening.

## Inputs
Management sources, target hosts, domain/trust context, authentication method, firewall, listeners, certificates where HTTPS is used, and privilege model.

## Preconditions
Maintain an alternate recovery path before changing remote-management settings on critical systems.

## Context to inspect
WinRM service/listeners, firewall rules, TrustedHosts, authentication configuration, SPNs, network profile, session configuration, JEA endpoints, event logs, and GPO ownership.

## Core knowledge
Domain Kerberos is preferable to weakening trust with broad TrustedHosts. HTTPS protects transport but does not replace authorization. Remoting endpoints can constrain language, commands, and identity through JEA. The double-hop problem should be solved deliberately.

## Procedure
1. Define management sources, target scope, and required commands.
2. Determine trust/authentication path.
3. Inspect existing listeners, policy, firewall, and endpoint configuration.
4. Test name resolution and port reachability.
5. Validate authentication and authorization separately.
6. Prefer Kerberos and constrained endpoints for domain environments.
7. Use JEA for delegated operational tasks when full admin is unnecessary.
8. Test remote execution, error propagation, and disconnect behavior.
9. Centralize policy and logging where practical.
10. Document recovery access and delegation boundaries.

## Decision points
Use HTTPS when trust/network requirements justify it; do not add hosts broadly to TrustedHosts as a convenience. Use JEA when operators need a bounded command surface.

## Common failure patterns
Disabling authentication protections, wildcard TrustedHosts, opening firewall scope globally, confusing connectivity with authorization, using CredSSP casually, and losing remote access through untested policy.

## Verification
Verify expected principals can perform only intended operations, unauthorized principals cannot, logs are generated, and remote management survives representative network/policy conditions.

## Expected output
A least-privilege, diagnosable Windows management plane.

## Stop conditions
Stop when proposed changes broaden trust materially, alternate recovery is absent, credential delegation is not approved, or security policy forbids the authentication method.