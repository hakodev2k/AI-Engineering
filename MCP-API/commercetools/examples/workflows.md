# Workflow examples

## Product discovery
Tool: `commercetools.product.search`
Input: `{ "text": "running shoe", "limit": 10 }`
Permission: READ. Approval: no.
Output: commercetools ProductProjection paged result.

## Prepare a cart
Tool: `commercetools.cart.create`
Input: `{ "currency": "EUR", "country": "DE", "approved": true }`
Permission: WRITE. Approval: yes, and `COMMERCETOOLS_APPROVE_WRITES=true`.
Output: created Cart.

## Add a SKU
Tool: `commercetools.cart.add_line_item`
Input: `{ "cartId": "cart-id", "version": 1, "sku": "SKU-1", "quantity": 1, "approved": true }`
Permission: WRITE. Approval: yes.
Output: updated Cart.
