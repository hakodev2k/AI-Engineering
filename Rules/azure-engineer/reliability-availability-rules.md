# Reliability and Availability Rules

## Purpose
Design Azure workloads to meet explicit resilience and availability requirements.

## Scope
Availability zones, regions, redundancy, failover, health probes, dependency resilience, SLAs, SLOs, and failure modes.

## MUST
- Translate business availability requirements into measurable architecture targets.
- Identify single points of failure across compute, data, network, identity, and dependencies.
- Validate that selected Azure service tiers support required resilience features.
- Define degraded behavior and failover expectations for critical dependencies.
- Test material resilience assumptions rather than relying only on service documentation.

## MUST NOT
- Claim high availability by counting replicas without analyzing failure domains.
- Assume a platform SLA equals an end-to-end workload SLA.
- Add multi-region complexity without justified recovery or availability requirements.

## SHOULD
- Prefer simple resilient designs whose failure behavior can be operated confidently.

## Exceptions
Accepted reliability gaps require impact analysis, owner, compensating measures, and explicit risk acceptance.

## Verification
Inspect architecture, service tiers, zone configuration, SLOs, failure tests, health signals, and dependency maps.