# Locale Architecture and Fallbacks

## Purpose
Design locale resolution, inheritance, and fallback behavior that remains predictable across UI, prompts, retrieval, generated content, and external services.

## When to use
Use when introducing locale-aware architecture, fixing inconsistent language behavior, or integrating services with different locale identifiers.

## Inputs
Supported locales, request context, user profile rules, UI framework, model APIs, content stores, translation assets, and fallback policy.

## Preconditions
Canonical locale identifiers and ownership rules are defined.

## Context to inspect
Inspect locale middleware, headers, account preferences, device locale, translation catalogs, prompt loading, content indexing, caches, and service contracts.

## Core knowledge
Locale resolution requires explicit precedence. Language fallback can be useful for content availability but dangerous for compliance, terminology, and generated actions. Cache and retrieval keys must preserve locale boundaries when content differs.

## Procedure
1. Define canonical locale format and normalization rules.
2. Establish precedence among explicit user choice, account setting, request header, device setting, and default.
3. Map service-specific locale codes to canonical values.
4. Define fallback chains by content class.
5. Prevent fallback across prohibited legal or policy boundaries.
6. Include locale in relevant cache, index, and experiment keys.
7. Define behavior for unknown or partially supported locales.
8. Add tests for resolution, fallback, and boundary conditions.

## Decision points
Fallback to a parent language only when semantic and policy risk is acceptable. Prefer explicit failure or neutral fallback for regulated or high-impact content.

## Common failure patterns
Implicit English fallback, inconsistent locale parsing, cache contamination across regions, script loss during normalization, and silently accepting unsupported locale codes.

## Verification
Run resolution tests for all supported locales and representative invalid inputs. Verify retrieved content, prompts, UI, and generated output use the same resolved locale.

## Expected output
A documented locale-resolution contract plus tested fallback behavior.

## Stop conditions
Stop when canonical locale ownership is disputed or fallback could violate regulatory, contractual, or safety requirements.