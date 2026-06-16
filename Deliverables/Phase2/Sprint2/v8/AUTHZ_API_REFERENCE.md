# Authorization API Reference

## Authorization model

- Authentication is handled by backend JWT verification plus a server-side session record.
- Authorization is enforced in backend controllers and services, not in client code.
- Manager roles are used for administrative operations:
  - `NetworkManager`
  - `CanteenManager`
  - `RefectoryManager`
  - `StockManager`

## Contextual checks

- Session creation stores the originating IP address and user-agent.
- Each authenticated request compares the current IP/user-agent against the stored session context.
- If the contextual attributes change, the session is revoked and the request is denied.
- User role changes are evaluated from the current database row, so authorization updates apply immediately.

## Application authorization

- `POST /applications` requires authentication and binds the application to the authenticated user.
- `PUT /applications/:applicationId` requires authentication and only lets the owner or a manager modify the application.
- `GET /applications/user/:userId` requires authentication and only allows the owner or a manager to view the record.
- `GET /applications` is restricted to `NetworkManager`.
- `GET /applications/:applicationId/documents/:filename` is restricted to the owner or a manager.
- `POST /applications/:applicationId/accept` and `POST /applications/:applicationId/reject` are restricted to `NetworkManager`.

## Reservation authorization

- `POST /reservations` requires authentication and uses the authenticated user ID.
- `GET /reservations` returns only the caller's reservations unless the caller has a manager role.
- `PATCH /reservations/:id/cancel`, `PATCH /reservations/:id/status`, and `POST /reservations/:id/lift` require ownership or a manager role.

## Notification authorization

- `POST /notifications` is restricted to `NetworkManager`.
- `GET /notifications/user/:userId` is allowed only for the owner or a manager.
- `PUT /notifications/:id` can only be performed by the owner of the notification or a manager.

## Field-level controls

- Non-managers cannot set application approval fields when creating or updating applications.
- Reservation ownership is derived from the authenticated user, not from the request body.
- Notification ownership is validated before read/update operations.

## Notes

- The application does not yet have a multi-tenant authorization model.
- Device posture assessment and step-up authentication are not implemented yet.
