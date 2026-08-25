# Cloudinary connector examples

## Discover and inspect

Tool: `cloudinary.asset.search`

Input:
```json
{"expression":"resource_type:image AND tags=product","maxResults":20}
```

Permission: READ. Approval: no.

Expected output shape:
```json
{"data":{"resources":[{"public_id":"..."}],"next_cursor":"..."},"untrusted_provider_content":true}
```

## Upload

Tool: `cloudinary.asset.upload`

Input:
```json
{"file":"https://example.com/image.jpg","folder":"incoming","resourceType":"image","approvalId":"<HMAC approval token>"}
```

Permission: WRITE. Approval: required.

## Rename

Tool: `cloudinary.asset.rename`

Input:
```json
{"fromPublicId":"incoming/a","toPublicId":"catalog/a","resourceType":"image","type":"upload","approvalId":"<HMAC approval token>"}
```

Permission: HIGH_RISK. Approval: required.

## Delete

Tool: `cloudinary.asset.delete`

Input:
```json
{"publicId":"catalog/a","confirmPublicId":"catalog/a","resourceType":"image","type":"upload","approvalId":"<HMAC approval token>"}
```

Permission: DESTRUCTIVE. Approval: required; exact public ID confirmation is additionally enforced.
