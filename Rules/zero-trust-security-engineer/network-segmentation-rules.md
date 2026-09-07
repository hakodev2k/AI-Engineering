# Network Segmentation Rules

## Purpose
Reduce attack paths and blast radius by making network reachability intentional, minimal, and independently enforced.

## Scope
Applies to east-west and north-south traffic, cloud networks, data centers, Kubernetes networks, administrative planes, and remote access.

## MUST
- Network flows MUST be explicitly justified by application or operational dependency.
- Sensitive zones MUST restrict ingress and egress to required peers, ports, and protocols.
- Administrative interfaces MUST be isolated from general user and application traffic.
- Segmentation changes MUST consider lateral-movement and failure-domain impact.

## MUST NOT
- MUST NOT treat segmentation as a substitute for identity-based authorization.
- MUST NOT allow broad any-to-any rules without documented necessity and approval.
- MUST NOT expose management planes directly to untrusted networks when a controlled access path exists.

## SHOULD
- Segmentation SHOULD be expressed declaratively and version-controlled where practical.
- Network policy SHOULD be validated against observed legitimate flows before tightening production access.

## Exceptions
Temporary broad access requires owner, rationale, monitoring, expiry, rollback plan, and human approval.

## Verification
Review firewall and network-policy diffs, flow logs, reachability analysis, attack-path tests, and denied-path tests from representative source identities and networks.