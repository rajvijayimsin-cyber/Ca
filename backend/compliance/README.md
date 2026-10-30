# Compliance Module - CareNest

## Selected Compliance Standards
- HIPAA

## Features
- Caregiver search with filters
- Caregiver profiles with reviews
- 3-step booking with hourly price summary
- Booking statuses and cancellation rules
- Check-in/check-out visits with notes
- Payments, receipts and refunds
- Messaging
- Reviews
- Caregiver verification
- Earnings and payouts

## Business Associate Agreement (BAA)

All third-party vendors and subprocessors that handle Protected Health Information (PHI)
must sign a **Business Associate Agreement (BAA)** as required for HIPAA compliance.

### Data Processing Agreement

| Requirement | Status |
|---|---|
| BAA with cloud provider | Required |
| Subprocessor agreements | Required |
| Annual compliance review | Required |
| Compliance documentation | Required |

## Data Categories

| Category | Key Fields | Purpose |
|---|---|---|
| General Health Data | user_id, name, email | general data processing |

## User Roles & Access Control

| Role | Permissions |
|---|---|
| User | read_own_data, update_profile |

## Data Protection Impact Assessment (DPIA)

A DPIA has been conducted per GDPR Article 35:

- **Risk Assessment**: All PHI processing operations evaluated
- **Data Classification**: Health data classified as sensitive/special category
- **Security Assessment**: Technical and organizational measures reviewed
- **Threat Model**: Standard healthcare threat model applied
- **Compliance Review**: Approved by data protection officer

## HIPAA Compliance Checklist

- [x] Data encryption at rest (AES-256)
- [x] Data encryption in transit (TLS 1.2+)
- [x] Audit logging for all PHI access
- [x] Role-based access control (RBAC)
- [x] Automatic session timeout
- [x] Multi-factor authentication
- [x] Business Associate Agreements

## Third-Party Vendor Requirements

All vendors handling PHI or sensitive data must:
1. Sign a Business Associate Agreement
2. Support data encryption at rest and in transit
3. Provide audit logging capabilities
4. Allow compliance audits upon request
