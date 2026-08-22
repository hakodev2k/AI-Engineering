# Routing and Navigation Rules

## Purpose
Keep navigation contracts secure, lazy-loadable, observable, and backward compatible where required.

## Scope
Routes, lazy loading, guards, resolvers, parameters, redirects, and deep links.

## MUST
- Treat externally shared URLs, route parameters, and deep links as public contracts when consumers depend on them.
- Lazy-load substantial feature boundaries when it improves startup cost without harming critical navigation.
- Handle invalid, missing, and unauthorized route state explicitly.
- Keep authorization enforcement on trusted backend boundaries even when route guards improve UX.

## MUST NOT
- Treat a client-side guard as a security boundary.
- Break bookmarked or externally linked routes without an approved migration/redirect strategy.
- Put sensitive information in URLs when it can leak through history, logs, or referrers.

## SHOULD
- Keep route data loading cancellable and aligned with navigation lifecycle.

## Exceptions
Intentional breaking route changes require impact analysis, owner approval, and migration communication.

## Verification
Run routing tests for deep links, refresh, redirects, authorization states, invalid parameters, and lazy chunks.