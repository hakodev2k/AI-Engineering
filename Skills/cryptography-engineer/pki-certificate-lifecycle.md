# PKI and Certificate Lifecycle

## Purpose
Design and operate certificate-based trust from issuance through renewal, revocation, rollover, and root/intermediate migration.

## When to use
Use for internal PKI, public certificates, workload identity, device identity, code signing, or certificate automation.

## Inputs
Identity model, certificate profiles, trust anchors, issuance workflow, validity periods, revocation needs, and availability requirements.

## Context to inspect
CA hierarchy, registration authority, SAN/subject rules, EKUs, key generation, issuance authorization, trust stores, renewal automation, revocation distribution, and audit logs.

## Core knowledge
PKI is a trust and lifecycle system, not only certificate generation. Certificate profiles must constrain identity and purpose. Root and intermediate keys have different exposure and availability trade-offs.

## Procedure
1. Define relying parties and identity semantics.
2. Design CA hierarchy and offline/online boundaries.
3. Specify certificate profiles, EKUs, names, algorithms, and validity.
4. Authenticate enrollment and issuance authorization.
5. Protect CA signing keys according to impact.
6. Automate issuance and renewal where possible.
7. Define revocation and compromise response.
8. Plan intermediate/root rollover with overlapping trust.
9. Monitor expiry, issuance anomalies, and trust-store drift.
10. Test renewal, revocation, rollover, and disaster recovery.

## Decision points
Short-lived certificates can reduce dependence on revocation but require highly reliable automation. Offline roots reduce exposure while increasing ceremony and recovery complexity.

## Common failure patterns
Overbroad EKUs; unauthenticated enrollment; long-lived leaf certificates; manual renewal; no root rollover plan; treating subject CN as universal identity; online root CA.

## Verification
Issue representative certificates, validate path/purpose/name, exercise renewal and revocation, and perform a controlled rollover simulation.

## Expected output
A PKI profile and lifecycle architecture with hierarchy, issuance controls, automation, revocation, rollover, and recovery.

## Stop conditions
Stop if identity proofing, CA custody, relying-party trust behavior, or recovery ownership is undefined.