# Self-Service Data Platform

## Purpose
Design paved roads that let data teams provision, develop, test, deploy, discover, and operate workloads safely without routine platform-team intervention.

## When to use
Use when platform tickets, inconsistent tooling, or duplicated infrastructure constrain delivery.

## Inputs
User journeys, support tickets, team personas, common workload patterns, governance requirements, platform APIs, and adoption metrics.

## Context to inspect
Onboarding time, templates, CLI/portal workflows, documentation, IAM, environment provisioning, deployment pipelines, and common escape hatches.

## Core knowledge
Self-service is a product capability, not merely a portal. Good platform abstractions reduce cognitive load while retaining escape hatches for legitimate advanced needs. Golden paths should encode security and operational defaults.

## Procedure
1. Interview users and rank repetitive friction by frequency and impact.
2. Define supported workload archetypes.
3. Create opinionated templates and APIs around stable platform capabilities.
4. Automate identity, environments, policies, observability, and deployment defaults.
5. Provide local/test workflows and clear failure messages.
6. Make ownership and cost attribution automatic.
7. Document extension points and supported escape hatches.
8. Pilot with real teams before broad rollout.
9. Measure time-to-first-workload, adoption, failure rate, and ticket reduction.
10. Deprecate obsolete paths with migration support.

## Decision points
Abstract complexity that is repetitive and non-differentiating; expose underlying controls when users need meaningful architectural choices. A CLI/API often provides better automation than a UI alone.

## Common failure patterns
Building a portal before understanding workflows, hiding critical errors, one template for every workload, mandatory golden paths that cannot handle legitimate exceptions, and measuring success by feature count.

## Verification
Have representative teams onboard without platform intervention, test policy defaults, measure delivery lead time, and observe whether support demand decreases without increasing incidents.

## Expected output
Supported golden paths, templates/APIs, documentation, adoption telemetry, governance defaults, and deprecation lifecycle.

## Stop conditions
Stop when abstraction would conceal material security/cost decisions or when user research does not support the proposed workflow.