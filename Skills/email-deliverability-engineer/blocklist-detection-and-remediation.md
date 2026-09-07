# Blocklist Detection and Remediation

## Purpose
Investigate IP/domain blocklist signals proportionally, determine whether they correlate with real delivery impact, and remediate underlying abuse or quality causes before requesting delisting.

## When to use
Use after blocklist alerts, mailbox-provider blocks referencing a list, or reputation investigations. Do not treat every low-impact list as an incident.

## Inputs
Listed IP/domain, list name and evidence, SMTP responses, sending history, complaint/bounce data, acquisition sources, authentication, and recent security incidents.

## Preconditions
Confirm the listing is current and that the queried identity is actually used for production mail.

## Context to inspect
Inspect provider delivery impact, compromised credentials, open relay/proxy risk, list quality, unexpected volume spikes, shared IP ownership, and recent infrastructure changes.

## Core knowledge
Blocklists differ greatly in influence and listing policy. Delisting without root-cause correction invites relisting. On shared infrastructure, the ESP may own remediation. Mailbox providers also maintain private reputation systems independent of public lists.

## Procedure
1. Validate the listing directly from the authoritative list source.
2. Determine affected identity, listing reason, and timestamp.
3. Check whether target mailbox providers reference or correlate with the listing.
4. Investigate compromise, abusive acquisition, complaints, traps, or misconfiguration.
5. Stop the harmful source and secure credentials/infrastructure if needed.
6. Clean recipient and suppression data as evidence requires.
7. Stabilize sending before requesting delisting.
8. Follow the list's legitimate remediation process; do not automate repeated requests.
9. Monitor for relisting and provider recovery.

## Decision points
Prioritize high-impact lists with observed delivery effects. On shared IPs, escalate through the provider rather than attempting unauthorized remediation. Rotate infrastructure only for legitimate architecture reasons, never to evade a block.

## Common failure patterns
Panic over obscure lists, delisting before fixing the cause, IP hopping, paying untrusted third parties, ignoring compromised API keys, and failing to preserve incident evidence.

## Verification
Confirm the harmful source is removed, security controls are restored, listing status changes, and provider-specific delivery/reputation recover without recurrence.

## Expected output
A listing impact assessment, proven root cause, remediation record, and recovery monitoring plan.

## Stop conditions
Stop sending affected non-critical traffic if compromise or severe abuse is suspected; escalate when infrastructure ownership or provider authority is external.