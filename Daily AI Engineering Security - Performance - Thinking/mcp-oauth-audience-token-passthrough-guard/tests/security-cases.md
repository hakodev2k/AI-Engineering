# Security Verification Cases

Use synthetic decoded claims and dummy bearer strings only.

| Case | Mutation | Expected |
|---|---|---|
| valid-read | correct issuer/audience/expiry + `profile.read` | allow |
| wrong-audience | audience is another API | deny: `wrong_or_missing_audience` |
| expired | expiry older than skew | deny: `expired` |
| missing-scope | read tool without `profile.read` | deny: `missing_required_scope` |
| direct-passthrough | outbound bearer equals inbound bearer | deny: `token_passthrough` |
| unknown-provenance | different outbound token but provenance unknown | deny: `unapproved_outbound_provenance` |
| upstream-auth-unavailable | no approved outbound credential available | application must fail closed; never substitute inbound token |

## Verification requirements
The protected tool/downstream side effect counter must remain zero for every deny case. Logs and test artifacts must not contain raw bearer values. The independent verifier must execute all cases after the implementation owner finishes.
