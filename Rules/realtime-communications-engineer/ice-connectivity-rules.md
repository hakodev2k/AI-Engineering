# ICE Connectivity Rules

## Purpose
Make peer connectivity reliable across real-world networks.

## Scope
ICE gathering, candidates, nomination, restarts, NAT traversal, and connectivity checks.

## MUST
- Candidate handling MUST tolerate trickle timing and duplicates safely.
- ICE failure MUST expose actionable state and support a bounded recovery path.
- ICE restarts MUST preserve session identity and avoid unnecessary media teardown.
- Candidate policy MUST account for IPv4, IPv6, NAT, firewall, and enterprise-network constraints.

## MUST NOT
- MUST NOT log private candidate data beyond approved diagnostic policy.
- MUST NOT retry connectivity indefinitely without backoff and termination criteria.
- MUST NOT treat host-only success as representative production connectivity.

## SHOULD
- Connectivity tests SHOULD include restrictive NAT and packet-loss conditions.

## Exceptions
Restricted candidate policies require documented security/privacy rationale and measured reachability impact.

## Verification
Use ICE stats, candidate-pair traces, NAT test matrices, failure injection, and end-to-end connectivity tests.