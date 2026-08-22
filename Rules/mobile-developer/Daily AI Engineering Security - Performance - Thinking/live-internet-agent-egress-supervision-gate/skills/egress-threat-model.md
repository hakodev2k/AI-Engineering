# Skill: Egress Threat Model

## Purpose
Convert a natural-language agent task into a machine-checkable external-communication threat model and authorization boundary.

## Trigger
Before enabling browser, HTTP, shell-with-network, Git remote, messaging, email, package-manager, DNS, tunnel, or webhook tools.

## Inputs
Task goal, explicitly authorized targets, tools, identities, data classes, environment, and `config/egress-policy.json`.

## Preconditions
The operator can identify the legitimate target systems or can choose a deny-by-default discovery phase.

## Required context
Only the task objective, known destinations, required action classes, and security constraints. Do not ingest unrelated secrets.

## Allowed tools
Read-only configuration inspection, DNS resolution without connection when available, policy validation, and documentation lookup.

## Constraints
- MUST distinguish reachability from authorization.
- MUST NOT infer authorization from a destination merely being public.
- MUST NOT add a host because the agent requested it.
- SHOULD prefer exact hosts over wildcards.
- MUST identify indirect egress tools such as `git`, package managers, cloud CLIs, and tunnel utilities.

## Procedure
1. Enumerate every network-capable tool available to the agent.
2. Classify actions as `read`, `write`, `publish`, `account_create`, `message_send`, `credential_submit`, `tunnel_create`, or `delete`.
3. List explicitly authorized destinations and protocols.
4. Mark destinations as trusted, task-authorized, approval-only, or denied.
5. Identify data that may leave the environment and whether it contains credentials, source code, PII, or customer data.
6. Define policy expiry and approval scope.
7. Identify private/link-local/metadata endpoints that must remain unreachable unless explicitly required.
8. Produce adversarial cases: redirected URL, lookalike domain, new subdomain, package-manager fetch, DNS tunnel, external account creation, and shell-based network call.
9. Hand the model to the verifier before tool enablement.

## Decision points
- Unknown destination + read-only action: deny by default or require bounded discovery approval.
- Unknown destination + high-impact action: approval required; never auto-expand scope.
- Authorization ambiguity: stop external interaction and escalate.

## Expected output
A destination/action matrix, sensitive-data map, policy amendments, adversarial test cases, and explicit unresolved questions.

## Metrics
Coverage of network-capable tools, percent of destinations with explicit rules, percent of high-impact actions bound to approval, and adversarial-test pass rate.

## Verification
An independent verifier checks that every enabled network path maps to a policy decision and that denied fixtures cannot egress.

## Failure handling
If tool behavior cannot be mapped to a destination before execution, classify it as high risk and block until instrumented.

## Stop conditions
Complete when all network-capable tools have deterministic pre-egress enforcement and unresolved destinations are deny/approval-only.