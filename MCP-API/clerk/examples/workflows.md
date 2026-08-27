# Workflow examples

## Inspect a user

Tool: `clerk.user.get`  
Input: `{ "userId": "user_123" }`  
Permission: READ  
Approval: no  
Expected output: Clerk User JSON serialized as MCP text content.

## Create a user

Tool: `clerk.user.create`  
Input: `{ "emailAddress": ["person@example.com"], "firstName": "Example", "approval": "<trusted HMAC approval>" }`  
Permission: WRITE  
Approval: yes by default  
Expected output: created Clerk User JSON.

## Add an existing user to an organization

Tool: `clerk.organization.membership.create`  
Input: `{ "organizationId": "org_123", "userId": "user_123", "role": "org:member", "approval": "<trusted HMAC approval>" }`  
Permission: HIGH_RISK  
Approval: yes  
Expected output: created OrganizationMembership JSON.

## Invite a user to an organization

Tool: `clerk.organization.invitation.create`  
Input: `{ "organizationId": "org_123", "emailAddress": "invitee@example.com", "role": "org:member", "approval": "<trusted HMAC approval>" }`  
Permission: HIGH_RISK  
Approval: yes because Clerk sends an external invitation email  
Expected output: created OrganizationInvitation JSON.

## Destructive removal

Tool: `clerk.organization.membership.delete`  
Input: `{ "organizationId": "org_123", "userId": "user_123", "approval": "<trusted HMAC approval>" }`  
Permission: DESTRUCTIVE  
Approval: yes and `CLERK_ALLOW_DESTRUCTIVE=true` must be configured outside the agent  
Expected output: deleted OrganizationMembership JSON.
