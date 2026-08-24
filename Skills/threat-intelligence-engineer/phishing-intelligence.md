# Phishing Intelligence

## Purpose
Analyze phishing campaigns to identify targeting, infrastructure, delivery patterns, credential theft, malware, and prevention opportunities.

## When to use
Use for suspicious email clusters, brand impersonation, credential-harvest sites, or phishing-driven incidents.

## Inputs
Email headers/body, URLs, attachments, screenshots, sender metadata, authentication results, gateway telemetry, user reports.

## Context to inspect
Review SPF/DKIM/DMARC results, redirect chains, domains, kits, landing pages, attachment behavior, targeting, and internal clicks.

## Core knowledge
Handle active content safely. Sender display names and visible URLs are untrusted; campaign linkage requires more than superficial branding similarity.

## Procedure
1. Preserve original message and headers.
2. Extract and normalize artifacts without activating content.
3. Analyze authentication and delivery path.
4. Resolve redirect and domain relationships in a safe environment.
5. Classify lure, objective, payload, and targeted population.
6. Cluster messages using stable features.
7. Identify affected users and internal sightings.
8. Produce blocking, detection, takedown, and awareness actions.
9. Track infrastructure changes and campaign recurrence.

## Decision points
Prioritize containment when internal clicks or credential submission are evidenced. Use takedown when brand abuse is material and ownership/process is established.

## Common failure patterns
Opening links directly, trusting display names, blocking entire shared platforms, and failing to search for related internal messages.

## Verification
Confirm detections find representative samples, blocks do not create unacceptable collateral impact, and affected accounts are investigated where necessary.

## Expected output
Phishing campaign assessment with artifacts, targeting, impact, cluster logic, and actions.

## Stop conditions
Escalate when credential compromise, malware execution, legal takedown, or executive impersonation requires incident/legal response.