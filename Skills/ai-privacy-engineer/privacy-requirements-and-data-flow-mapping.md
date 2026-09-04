# Privacy Requirements and Data Flow Mapping

## Purpose
Translate product, legal, and security expectations into an evidence-backed privacy model for an AI system. This skill identifies where personal or sensitive data enters, moves, transforms, persists, and leaves the system so privacy controls are attached to real processing paths rather than assumptions.

## When to use
Use during architecture design, privacy review, major feature changes, vendor integration, model-training pipeline changes, or incident investigation. Do not rely on this skill alone for formal legal interpretation; escalate jurisdiction-specific legal questions.

## Inputs
- Product requirements and user journeys
- Architecture diagrams and source repository
- Data schemas and event definitions
- Model, vector store, analytics, logging, and telemetry configuration
- Third-party processor details
- Retention and deletion requirements

## Preconditions
Access to current architecture and configuration is required. Identify the deployment environments and applicable business boundaries before documenting flows.

## Context to inspect
Inspect request paths, background jobs, queues, caches, object stores, feature stores, vector databases, prompt traces, model providers, observability systems, backups, support tooling, and export pipelines. Confirm actual code and infrastructure rather than copying outdated diagrams.

## Core knowledge
A privacy-relevant data flow includes collection, inference, enrichment, storage, replication, disclosure, retention, and deletion. AI systems may create derived personal data through embeddings, classifications, profiles, summaries, or inferred attributes even when raw identifiers are removed. Data-flow maps should distinguish controller-owned systems, processors, subprocessors, and external recipients.

## Procedure
1. Define the system boundary and user populations.
2. Enumerate all data entry points.
3. Classify raw and derived data by sensitivity and identifiability.
4. Trace synchronous and asynchronous processing paths.
5. Identify every storage location, replica, cache, log, and backup.
6. Record model-provider and third-party disclosures.
7. Map retention and deletion behavior for each store.
8. Document purposes and legal/privacy requirements supplied by responsible stakeholders.
9. Mark trust-boundary crossings and geographic transfers.
10. Identify data minimization, access-control, encryption, and redaction controls already present.
11. Compare documented flows with source code and deployed configuration.
12. Record gaps, owners, and required remediation.

## Decision points
Use a logical data-flow map for design reviews and a deployment-specific map when infrastructure or jurisdiction changes behavior. Treat derived attributes as privacy-relevant when they can be linked back to a person or used to make decisions about them.

## Common failure patterns
- Omitting logs, embeddings, caches, or backups
- Treating pseudonymized data as anonymous without evidence
- Ignoring derived or inferred attributes
- Missing subprocessors or shadow integrations
- Documenting intended architecture instead of deployed reality
- Failing to map deletion propagation

## Verification
Verify by sampling real requests and tracing identifiers or synthetic markers through logs, stores, queues, and external calls. Confirm each documented storage location, retention rule, and outbound recipient against implementation evidence.

## Expected output
A current privacy data-flow map with data classes, purposes, trust boundaries, stores, recipients, retention behavior, controls, and unresolved risks.

## Stop conditions
Stop and escalate when required architecture access is unavailable, data ownership cannot be established, a previously unknown external recipient is discovered, or legal basis/purpose is ambiguous and requires privacy counsel.