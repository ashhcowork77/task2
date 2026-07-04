# Phase 1: Infrastructure Setup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-31
**Phase:** 1-Infrastructure Setup
**Areas discussed:** Monorepo + Payload location, Development workflow, Environment management

---

## Monorepo + Payload Location

| Option | Description | Selected |
|--------|-------------|----------|
| Payload inside Next.js (Recommended) | Payload embedded via @payloadcms/next plugin. Single 'app' directory, Payload admin at /admin. Simpler setup, recommended by Payload for most cases. | ✓ |
| Separate 'payload/' package | Standalone Payload package in monorepo workspace. Independent lifecycle, clearer separation. Better for future microservice extraction. | |
| Fully separate services | Payload and Next.js as completely independent repos/images. Maximum isolation but harder to develop locally. | |

**User's choice:** Payload inside Next.js (Recommended)
**Notes:** Standard approach, simpler setup

---

## Monorepo Structure

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm workspaces (Recommended) | Single repo with pnpm workspaces (payload/, frontend/, packages/). Shared tooling, easy cross-package imports, standard for monorepos. | ✓ |
| Single flat directory | Everything in one directory with subfolders (payload/, frontend/). Simpler, less tooling overhead. | |
| pnpm + packages/ shared | Payload and frontend as workspace packages, shared types/utilities in packages/shared/. Clean separation with shared layer. | |

**User's choice:** pnpm workspaces (Recommended)
**Notes:** Standard monorepo approach

---

## Development Workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Docker Compose + volume mounts (Recommended) | All services in Docker Compose. Source code mounted as volumes for hot reload. Consistent with production. Most reliable setup. | ✓ |
| Native Node.js + Docker Postgres only | Run Payload/Next.js natively on host for hot reload speed. Postgres in Docker. Hybrid approach. | |
| Full native development | Everything runs natively (Node.js, Postgres installed locally). Fastest reload but environment drift from production. | |

**User's choice:** Docker Compose + volume mounts (Recommended)
**Notes:** Consistency with production is important

---

## Port Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| Standard ports (Recommended) | Next.js: 3000, Payload API: 3000 (embedded), Postgres: 5432. Clean and simple. | ✓ |
| Separate Payload port | Next.js: 3000, Payload API: 4000, Postgres: 5432. More explicit separation but adds complexity. | |
| Custom ports | Let me specify custom ports for each service. | |

**User's choice:** Standard ports (Recommended)
**Notes:** Keep it simple

---

## Debugging Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — add launch configs | Add .vscode/launch.json for debugging Payload/Next.js with attached debugger. Useful for setting breakpoints. | ✓ |
| No — skip for now | Focus on infrastructure only. Debugging can be added later if needed. | |

**User's choice:** Yes — add launch configs
**Notes:** Want debugging support from the start

---

## Environment Management

| Option | Description | Selected |
|--------|-------------|----------|
| .env.example template (Recommended) | Commit .env.example with all required vars documented. Users copy to .env and fill values. Standard practice. | ✓ |
| Documentation-only | Document env vars in README only. No template file in repo. | |
| Dotenv-vault or similar | Use a secrets management tool like dotenv-vault for encrypted env sharing across team. | |

**User's choice:** .env.example template (Recommended)
**Notes:** Standard approach

---

## Optional Services

| Option | Description | Selected |
|--------|-------------|----------|
| All optional (Recommended) | Set up env vars for Google Places API, email (SendGrid/Resend), file storage (S3) now as placeholders. Reduces future changes. | ✓ |
| Minimal to start | Only DATABASE_URL and PAYLOAD_SECRET for now. Add others when actually needed. | |
| Let me specify | I want to specify which services to include env vars for now. | |

**User's choice:** All optional (Recommended)
**Notes:** All env vars included upfront

---

## Claude's Discretion

All questions were answered by the user. No areas deferred to Claude's discretion.

## Deferred Ideas

None — discussion stayed within phase scope
