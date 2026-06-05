# Contributing to Kaffeine

First off, thank you for considering contributing to Kaffeine! We welcome contributions from everyone, whether it's a bug report, a feature suggestion, a documentation improvement, or a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Submitting Code Changes](#submitting-code-changes)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report, please check the [existing issues](https://github.com/akkilmg/kaffeine/issues) to see if the problem has already been reported. If it hasn't, [open a new issue](https://github.com/akkilmg/kaffeine/issues/new?template=bug_report.md) using the bug report template.

When reporting a bug, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots or logs if applicable
- Your environment (OS, browser, Node.js version, etc.)

### Suggesting Features

Feature suggestions are welcome! [Open a feature request](https://github.com/akkilmg/kaffeine/issues/new?template=feature_request.md) using the feature request template. Describe the feature, why it would be useful, and any implementation ideas you have.

### Improving Documentation

Documentation improvements are one of the most valuable contributions you can make. This includes:

- Fixing typos or unclear wording
- Adding missing documentation
- Writing guides or tutorials
- Improving inline code comments (where needed)

### Submitting Code Changes

1. Fork the repository
2. Create a branch for your changes:
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bug-fix
   ```
3. Make your changes following the [coding guidelines](#coding-guidelines)
4. Ensure lint passes: `npm run lint`
5. Test your changes: `npm run build`
6. Commit your changes
7. Push to your fork and open a pull request

## Development Setup

### Prerequisites

- **Node.js** 18+
- **MongoDB** — local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** (comes with Node.js)

### Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/kaffeine.git
   cd kaffeine
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/akkilmg/kaffeine.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .example.env .env
   ```
   Edit `.env` with your values. At minimum, set `MONGODB_URI`, `ENCRYPTION_KEY`, and `JWT_SECRET`.

5. **Run the dev server**
   ```bash
   npm run dev
   ```

### Keeping Your Fork Updated

```bash
git checkout main
git pull upstream main
git push origin main
```

## Project Structure

```
kaffeine/
├── public/          # Static assets (images, fonts, etc.)
│   └── assets/logo/ # Logo files
├── src/
│   ├── app/         # Next.js App Router pages and API routes
│   │   ├── api/     # API endpoints (auth, kaffeiners, admin, cf)
│   │   └── ...      # Page routes (dashboard, login, register, etc.)
│   ├── components/  # React components
│   │   ├── ui/      # shadcn/ui components
│   │   ├── landing/ # Landing page components
│   │   ├── dashboard/
│   │   └── admin/
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Core libraries (auth, db, encryption, types)
│   └── assets/      # Client-side assets (lottie animations)
└── worker/          # Cloudflare Worker for health checks
```

## Coding Guidelines

### General

- **Language**: TypeScript with strict mode
- **Style**: Follow existing patterns in the codebase
- **Imports**: Group and order imports (React/framework → libraries → local)
- **Types**: Prefer explicit types over `any`. Use TypeScript interfaces for data models
- **Components**: Use named exports for components, kebab-case for filenames
- **Hooks**: Prefix with `use`, camelCase
- **API Routes**: Keep handlers focused — one responsibility per route

### Code Quality

- Run `npm run lint` before committing
- Avoid `any` — use proper types or `unknown` with type guards
- No debug logs (`console.log`) in committed code — use the `[Kaffeine]` prefixed `console.error` for errors only
- Handle errors gracefully — use the centralized `handleApiError` in API routes
- Use the centralized `getSessionUser` / `getAdminUser` helpers for auth, don't parse cookies manually

### Security

- Never commit secrets or API keys
- All user input must be validated on the server (not just client-side)
- Use `requireValidObjectId()` for MongoDB ObjectId parameters
- Sensitive data should use the encryption utilities in `src/lib/encryption.ts`
- Session cookies are managed by the server — don't attempt to read/modify them on the client

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system (CSS variables in `globals.css`)
- Use shadcn/ui components where possible for consistency

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new kaffeiner monitoring type
^───^  ^────────────────────────────^
│      └─ description in present tense
│
└─ type: feat, fix, chore, docs, style, refactor, perf, test, security
```

Common types:
- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring without feature changes or fixes
- `perf:` — Performance improvements
- `test:` — Adding or updating tests
- `chore:` — Build process, dependencies, tooling
- `security:` — Security fixes

## Pull Request Process

1. **Open a draft PR early** — share your work-in-progress for feedback
2. **Keep PRs focused** — one feature/fix per PR. If you have multiple unrelated changes, open separate PRs
3. **Write a clear description** — explain what the PR does and why
4. **Link related issues** — use `Closes #123` to auto-close issues on merge
5. **Update documentation** — if your change requires it
6. **Ensure the build passes** — `npm run build` must succeed
7. **Address review feedback** — make requested changes and re-request review

### PR Title Format

Follow the commit convention: `type: brief description`

Example: `feat: add PostgreSQL monitoring support`

### What Happens After Submission

1. Automated checks run (lint, build)
2. Maintainers review your code
3. Changes may be requested
4. Once approved, a maintainer merges your PR

## Security

If you discover a security vulnerability, please **do not** open a public issue. Instead, follow our [security policy](SECURITY.md) for responsible disclosure.

---

Thank you for contributing to Kaffeine! Every contribution makes a difference. 🚀
