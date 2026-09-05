# AI System Inventory and Classification

## Purpose
Build and maintain an authoritative inventory of AI systems, models, agents, vendors, and high-impact use cases so compliance obligations can be attached to real operational assets.

## When to use
Use when onboarding AI capabilities, preparing audits, assessing enterprise exposure, or reconciling shadow AI usage.

## Inputs
Application catalog, model/provider list, architecture diagrams, data flows, product owners, deployment environments, use-case descriptions.

## Preconditions
System owners or repositories are discoverable and there is authority to request missing metadata.

## Context to inspect
Procurement records, source repositories, cloud accounts, model gateways, API integrations, feature flags, data catalogs, deployment manifests.

## Core knowledge
An AI inventory should classify systems by business purpose, decision impact, autonomy, data sensitivity, model provenance, deployment geography, affected populations, and regulatory risk. A model list alone is insufficient because risk emerges from the whole system and use context.

## Procedure
1. Discover deployed and planned AI-enabled systems.
2. Identify accountable owner and technical operator.
3. Record model, provider, version, and hosting pattern.
4. Describe the user-facing or internal use case.
5. Capture data categories and affected populations.
6. Record autonomy and external side effects.
7. Classify risk and regulatory relevance using approved criteria.
8. Link system records to controls and assessments.
9. Define update triggers for material changes.
10. Reconcile inventory periodically against technical evidence.

## Decision points
Create separate inventory entries when the same model is used in materially different risk contexts. Group components only when ownership, controls, and regulatory treatment remain aligned.

## Common failure patterns
Inventorying only foundation models, missing embedded third-party AI, relying on self-report without technical discovery, and leaving stale versions after deployment changes.

## Verification
Sample inventory entries against production configurations and procurement records; confirm owners, versions, and classifications are current.

## Expected output
A controlled AI system register with ownership, technical metadata, use context, risk classification, and linked evidence.

## Stop conditions
Escalate when system ownership cannot be established, material AI use is undisclosed, or classification requires legal or safety interpretation.