# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Kaffeine seriously. If you believe you've found a security vulnerability, please follow these steps:

### Do NOT open a public issue

Please **do not** report security vulnerabilities through public GitHub issues, as this could put users at risk.

### Responsible Disclosure

1. **Email us**: Send details of the vulnerability to [arkynox.com](https://arkynox.com)
2. **Include**:
   - A description of the vulnerability
   - Steps to reproduce it
   - Potential impact
   - Any suggested fixes (if you have them)
3. **Give us time** to address the issue before public disclosure

### What to expect

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 5 business days
- We will work on a fix and keep you informed of progress
- Once fixed, we will credit the reporter (if desired)

## Security Measures

Kaffeine employs the following security measures:

- **Password Hashing**: bcrypt (cost factor 12)
- **Encryption**: AES-256-CBC with random IV for sensitive data
- **Session Management**: JWT-signed session cookies with `httpOnly`, `secure`, and `sameSite: strict`
- **Rate Limiting**: In-memory rate limiting on auth endpoints
- **Input Validation**: Server-side validation for all inputs, ObjectId validation
- **Dependency Security**: Regular dependency audits via `npm audit`
- **HTTPS**: Enforced in production via Strict-Transport-Security header

## Best Practices for Self-Hosting

1. **Environment Variables**: Always set strong, unique values for `JWT_SECRET`, `ENCRYPTION_KEY`, `CF_API_TOKEN`, and `CF_WORKER_SECRET`
2. **MongoDB**: Use a database with authentication enabled, restrict network access, and use a strong password
3. **HTTPS**: Always serve Kaffeine behind a reverse proxy with HTTPS enabled
4. **Updates**: Keep Kaffeine and its dependencies up to date
5. **Monitoring**: Monitor your instance for unusual activity
