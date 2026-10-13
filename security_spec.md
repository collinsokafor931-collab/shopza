# Security Specification & Threat Model

## 1. Data Invariants
1. A user document can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. A store can only be created or updated by its verified owner (`request.auth.uid == store.ownerId`).
3. A product can only be created, modified, or deleted by the seller who owns it (`request.auth.uid == product.sellerId`).
4. An order can only be read by the buyer (`buyerId == request.auth.uid`) or the fulfilling sellers (`request.auth.uid in sellerIds`).
5. Discounts can only be modified by the store owner (`request.auth.uid == discount.storeId`).
6. Customers CRM entries are strictly isolated to the store owner.
7. System role escalation (e.g. setting `role: 'admin'`) is blocked from standard client mutations.

## 2. Dirty Dozen Threat Payloads (Rejected by Rules)
1. **Unauthenticated Write**: Creating a product without `request.auth`.
2. **ID Poisoning**: Injecting 2000-character alphanumeric ID string into `userId` or `productId`.
3. **Owner Spoofing**: Attempting to set `sellerId: "victim-uid"` while logged in as an attacker.
4. **Price Tampering on Final Order**: Injecting `total: 0` while total items amount to ₦500,000.
5. **Ghost Field Injection**: Adding undeclared shadow keys like `_adminBypass: true`.
6. **Cross-Tenant Store Modification**: Updating another merchant's store branding or theme settings.
7. **Order Status Manipulation**: Buyer attempting to unilaterally set `status: "delivered"` before dispatch.
8. **Negative Inventory / Price**: Creating product with `price: -5000` or `stock: -10`.
9. **Unbounded Tags Injection**: Storing 100,000 items in the `tags` array causing memory/wallet denial.
10. **Customer CRM PII Scraping**: Attacker querying all customer email addresses and phone numbers.
11. **Discount Stealing**: Modifying another store's discount code usage limit or expiration.
12. **Role Hijacking**: User updating their own profile to `role: 'admin'` without administrative credentials.
