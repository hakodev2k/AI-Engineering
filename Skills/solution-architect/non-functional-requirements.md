# Non-Functional Requirements Engineering

## Purpose
Convert vague quality expectations into measurable architecture drivers for performance, availability, security, scalability, operability, maintainability, compliance, and cost.

## When to use
Use before selecting architecture patterns, cloud services, databases, integration styles, or deployment topology.

## Inputs
Traffic forecasts, business criticality, user expectations, regulatory needs, support model, budget, recovery targets, growth assumptions.

## Preconditions
Critical business journeys and system boundaries are known.

## Context to inspect
Current SLOs, incident history, latency percentiles, peak traffic, data sensitivity, dependency SLAs, maintenance windows, regional requirements, operational staffing.

## Core knowledge
Quality attributes conflict. A useful NFR is scenario-based and measurable: stimulus, environment, target behavior, and acceptance threshold. Architecture should optimize the attributes that matter most, not every attribute equally.

## Procedure
1. Enumerate relevant quality attributes.
2. Rank them by business impact and risk.
3. Define measurable scenarios for the highest priorities.
4. Capture expected normal, peak, degraded, and disaster conditions.
5. Define latency, throughput, availability, durability, RTO/RPO, capacity, and cost targets where relevant.
6. Link security and compliance requirements to data and trust boundaries.
7. Check dependency limitations against targets.
8. Identify conflicts and trade-offs.
9. Translate NFRs into architecture constraints and validation plans.
10. Review targets with product, engineering, security, and operations.

## Decision points
Prefer explicit SLOs over generic “high availability.” Use percentiles for latency rather than averages. Avoid unrealistic targets that exceed business value or dependency capabilities.

## Common failure patterns
Unmeasurable NFRs, copying generic checklists, ignoring degraded mode, treating cost as unlimited, confusing availability with durability, setting targets after implementation.

## Verification
Each high-priority NFR has a measurable target, owner, design implication, and planned validation method.

## Expected output
Prioritized NFR catalog tied to architecture decisions and verification evidence.

## Stop conditions
Stop if target values materially affect cost or feasibility but business owners will not accept quantified trade-offs.