# Example workflows

## Public breach research

Tool: `hibp.breach.latest`

Input:
```json
{}
```

Permission: `breach:read`
Risk: `READ`
Approval: not required

Expected output shape:
```json
{
  "source": "Have I Been Pwned",
  "untrustedData": true,
  "data": { "Name": "ExampleBreach", "Title": "Example Breach" }
}
```

## Investigate an email address

Tool: `hibp.account.breaches`

Input:
```json
{
  "email": "person@example.com",
  "includeUnverified": false
}
```

Permission: `account:breach:read`
Risk: `READ`
Approval: not required
Requires: `HIBP_API_KEY` and an eligible HIBP plan

Expected output shape:
```json
{
  "source": "Have I Been Pwned",
  "untrustedData": true,
  "data": [
    { "Name": "ExampleBreach", "Domain": "example.org", "DataClasses": ["Email addresses"] }
  ]
}
```

## Privacy-preserving password lookup

Hash the password locally with SHA-1 and send only the first five hex characters. Never send the plaintext password.

Tool: `hibp.password.range`

Input:
```json
{
  "prefix": "21BD1",
  "mode": "sha1",
  "padding": true
}
```

Permission: `password:range:read`
Risk: `READ`
Approval: not required

Expected output shape:
```json
{
  "source": "Have I Been Pwned",
  "untrustedData": true,
  "data": [
    { "suffix": "...", "count": 42 }
  ]
}
```

## Verified-domain exposure review

Tool: `hibp.domain.breaches`

Input:
```json
{
  "domain": "example.com"
}
```

Permission: `domain:breach:read`
Risk: `READ`
Approval: not required
Requires: `HIBP_API_KEY`, eligible plan, and domain verification completed in HIBP

Expected output shape:
```json
{
  "source": "Have I Been Pwned",
  "untrustedData": true,
  "data": {
    "alias": ["Adobe", "LinkedIn"]
  }
}
```
