---
phase: 03
slug: 03-activities-inquiry
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-01
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Payload CMS built-in + manual testing |
| **Config file** | none — payload collections tested via admin UI |
| **Quick run command** | `cd payload && npx tsc --noEmit` |
| **Full suite command** | `cd frontend && npx tsc --noEmit && docker compose up` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run TypeScript compilation check
- **After every plan wave:** Run full TypeScript check + admin verification
- **Before `/gsd:verify-phase`:** TypeScript must compile without errors
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3.1-01 | 01 | 1 | Activities collection created | T-3.1-01 | Public read, admin write | unit | `grep "slug: 'activities'" payload/src/collections/Activities.ts` | ✅ | ⬜ pending |
| 3.1-02 | 01 | 1 | Collections index updated | T-3.1-01 | N/A | unit | `grep "Activities" payload/src/collections/index.ts` | ✅ | ⬜ pending |
| 3.2-01 | 02 | 1 | inquirySchema created | T-3.2-01 | Input validation | unit | `grep "inquirySchema" frontend/src/lib/schemas.ts` | ✅ | ⬜ pending |
| 3.2-02 | 02 | 1 | submitInquiry action | T-3.2-04 | CSRF protection | unit | `grep "submitInquiry" frontend/src/lib/actions.ts` | ✅ | ⬜ pending |
| 3.2-03 | 02 | 1 | InquiryForm component | T-3.2-01 | Error sanitization | unit | `grep "InquiryForm" frontend/src/components/InquiryForm.tsx` | ✅ | ⬜ pending |
| 3.3-01 | 03 | 2 | activityReference added | T-3.3-01 | N/A | unit | `grep "relationTo: 'activities'" payload/src/collections/Leads.ts` | ✅ | ⬜ pending |
| 3.3-02 | 03 | 2 | activityInquirySchema | T-3.3-01 | Input validation | unit | `grep "activityInquirySchema" frontend/src/lib/schemas.ts` | ✅ | ⬜ pending |
| 3.3-03 | 03 | 2 | submitActivityInquiry | T-3.3-04 | CSRF protection | unit | `grep "submitActivityInquiry" frontend/src/lib/actions.ts` | ✅ | ⬜ pending |
| 3.3-04 | 03 | 2 | ActivityInquiryForm | T-3.3-01 | Error sanitization | unit | `grep "ActivityInquiryForm" frontend/src/components/ActivityInquiryForm.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] TypeScript configuration verified
- [ ] Payload collections schema validated
- [ ] Server Actions syntax verified

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin form rendering | Phase success criteria | Payload admin UI requires manual verification | 1. Run `docker compose up` 2. Navigate to localhost:3000/admin 3. Verify Activities collection visible |
| Form submission end-to-end | Phase success criteria | Requires running Payload instance | 1. Create test property 2. Submit inquiry form 3. Verify lead created in admin |
| Activity-Property link | Phase success criteria | Relationship requires live data | 1. Create activity 2. Link to property 3. Verify relationship saved |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
