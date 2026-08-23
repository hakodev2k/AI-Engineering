# Tagging and Metadata Rules

## Purpose
Maintain reliable cost ownership and business context through enforceable resource metadata.

## Scope
Cloud tags, labels, account hierarchy, subscription metadata, resource groups, cost categories, and ownership directories.

## MUST
- Define mandatory metadata fields with allowed values, ownership, and lifecycle rules.
- Validate metadata at provisioning time where platform controls allow it.
- Detect missing, invalid, stale, and conflicting metadata continuously.
- Ensure ownership metadata resolves to an active accountable team or cost center.

## MUST NOT
- Depend on free-form tags for critical allocation dimensions when controlled values are available.
- Treat tagging coverage percentage alone as proof that allocation is correct.
- Delete or rename allocation-critical metadata without assessing reporting impact.

## SHOULD
- Enforce metadata through infrastructure-as-code policies and reusable provisioning templates.
- Maintain mappings for resources that cannot carry native tags.

## Exceptions
Legacy or vendor-managed resources may use documented external mappings when native enforcement is impossible.

## Verification
Inspect policy configuration, provisioning tests, metadata coverage, invalid-value reports, orphaned-owner reports, and samples traced from billing records to accountable owners.