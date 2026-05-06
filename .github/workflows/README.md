# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the voiceyBill Mobile app. These workflows ensure code quality, security, and consistency when contributors submit pull requests.

## 📋 Workflows Overview

### Core CI/CD Workflows

#### 🔄 `ci.yml` - Continuous Integration
**Triggers:** Pull requests and pushes to main/master/develop branches

- **Installs dependencies** and caches npm modules
- **Linting**: Checks code style (if configured)
- **Type checking**: Validates TypeScript compilation
- **Testing**: Runs unit tests and uploads coverage to Codecov
- **Build validation**: Verifies the app can build successfully

**Key jobs:**
- `install-and-cache`: Installs deps once for reuse
- `lint`: Code style validation
- `type-check`: TypeScript compilation
- `test`: Unit test execution
- `validate`: Final build verification

---

#### 🏗️ `build-test.yml` - Platform Build Testing
**Triggers:** PR changes in src/ or package.json, pushes to main/develop

- Tests Expo prebuild configuration
- Validates Metro bundler setup
- Checks package integrity
- Audits for security issues

**Ensures:** App builds correctly across Android/iOS

---

#### 📦 `performance.yml` - Performance Monitoring
**Triggers:** Changes to src/ or dependencies, pushes to main

- **Bundle size analysis**: Monitors app size
- **Dependency analysis**: Checks for duplicates and critical deps
- **Type coverage**: Validates TypeScript coverage

**Comments on PRs:** Performance impact summary

---

### Quality & Security

#### 🔐 `code-quality.yml` - Code Quality Analysis
**Triggers:** All PRs and pushes to main/develop

- ESLint checks
- Code formatting validation (Prettier)
- Security vulnerability scanning
- File size monitoring
- TODO/FIXME comment detection
- TypeScript strict mode validation

---

#### 🛡️ `codeql.yml` - Security Scanning
**Triggers:** PRs, pushes to main, weekly schedule

- GitHub's CodeQL analysis for security vulnerabilities
- Detects common security patterns and issues
- Reports to GitHub Security tab

---

#### 🔍 `dependency-review.yml` - Dependency Vulnerability Scan
**Triggers:** All pull requests

- Scans for vulnerable dependencies
- Fails on high-severity vulnerabilities
- Provides detailed security reports

---

#### ✅ `expo-config.yml` - Expo & Native Config Validation
**Triggers:** Changes to app.json, package.json, babel config

- Validates `app.json` structure and required fields
- Checks Expo plugins configuration
- Validates `package.json`
- Checks Babel configuration
- Verifies environment setup

---

### PR Management & Automation

#### 📝 `pr-title.yml` - PR Title Validation
**Triggers:** PR opened, edited, or reopened

- Enforces Conventional Commits format
- Required format: `type(scope): subject`
- Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

Example valid titles:
- `feat(mobile): Add voice recording support`
- `fix(auth): Resolve token refresh issue`
- `docs(readme): Update setup instructions`

---

#### 🏷️ `labeler.yml` - Automatic PR Labeling
**Triggers:** PR opened, synchronized, reopened, ready for review

- Automatically applies labels based on changed files
- Creates labels if they don't exist
- Helps organize and categorize PRs

**Available labels:**
- `mobile`: Mobile app changes
- `android`, `ios`: Platform-specific changes
- `ui`: User interface changes
- `feature`: New features
- `state-management`: Redux/Context changes
- `navigation`: Navigation changes
- `audio`: Voice/audio features
- `api-integration`: API changes
- `dependencies`: Dependency updates
- `config`: Configuration changes
- `ci/cd`: Workflow changes
- `docs`: Documentation
- `testing`: Test changes
- And more!

---

#### 📋 `issue-severity-labeler.yml` - Issue Severity Labeling
**Triggers:** Issues opened or edited

- Creates severity labels
- Guides contributors to add severity labels
- Labels: `severity-critical`, `severity-high`, `severity-medium`, `severity-low`

---

#### 💬 `pr-guidelines.yml` - PR Guidelines Enforcement
**Triggers:** PR opened, edited, or synchronized

- Validates PR description presence
- Checks for related issue references
- Alerts when critical files are modified
- Provides guidance on best practices

---

#### 👋 `contributor-onboarding.yml` - Contributor Welcome
**Triggers:** PR opened, issues opened

- Welcomes first-time contributors
- Provides development setup checklist
- Links to contribution guidelines and code of conduct
- Shares helpful resources

---

#### 🗑️ `stale.yml` - Stale Issues/PRs Management
**Triggers:** Weekly schedule (Sundays at midnight)

- Marks inactive issues as stale after 60 days
- Marks inactive PRs as stale after 30 days
- Closes stale items after additional inactivity period
- Exempts pinned, security, and help-wanted issues

**Stale lifecycle:**
- 60 days (issues) / 30 days (PRs) → marked stale
- +14 days (issues) / +7 days (PRs) → closed

---

### Release Management

#### 🎉 `release.yml` - Automated Release Creation
**Triggers:** Git tags matching `v*` pattern

- Automatically creates GitHub releases
- Generates changelog from commits
- Marks pre-releases for alpha/beta/rc tags
- Provides installation instructions

**Usage:**
```bash
git tag v1.2.3
git push origin v1.2.3
```

---

#### 📌 `version-management.yml` - Version Bumping
**Triggers:** Manual workflow dispatch

- Bumps version in `package.json` and `app.json`
- Creates git tag and commits
- Pushes changes to main branch
- Supports patch, minor, and major version bumps

**Usage:**
1. Go to Actions → "Version & Release Management"
2. Click "Run workflow"
3. Select version bump type (patch/minor/major)

---

## 🚀 Quick Reference

### What happens when I open a PR?

1. **Immediate checks:**
   - ✅ Title validation (Conventional Commits)
   - 🏷️ Auto-labeling based on changed files
   - ✅ PR description validation

2. **CI checks (5-10 minutes):**
   - 📦 Install dependencies
   - 🔍 Lint code
   - ✅ Type checking
   - 🧪 Run tests
   - 🏗️ Build validation

3. **Security checks:**
   - 🔐 CodeQL analysis
   - 🔍 Dependency scanning
   - ⚠️ Vulnerability detection

4. **Quality checks:**
   - 📈 Performance monitoring
   - 🔒 Security scanning
   - 📋 Code quality analysis

5. **Feedback:**
   - Comments on performance impact
   - Alerts for critical file changes
   - Development setup guidance

### Common Workflow Statuses

| Status | Meaning |
|--------|---------|
| ✅ Passing | All checks passed, ready to merge |
| ❌ Failed | One or more checks failed, review logs |
| ⏳ In Progress | Checks still running |
| ⏭️ Skipped | Check didn't apply to this change |

## 🔧 Maintenance

### Viewing Workflow Runs

1. Go to "Actions" tab in your GitHub repository
2. Select a workflow to see runs
3. Click a run to see detailed logs
4. Expand job names to see step details

### Troubleshooting Failed Checks

1. **Lint failures**: Run `npm run lint` locally to find issues
2. **Type errors**: Run `npx tsc --noEmit` to check types
3. **Test failures**: Run `npm test` locally
4. **Build errors**: Check `npm run build` output
5. **Security warnings**: Review CodeQL and dependency alerts

### Updating Workflows

- Edit `.github/workflows/*.yml` files directly
- Changes take effect on next workflow run
- Test changes on a feature branch first

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Contributing Guide](../../CONTRIBUTING.md)

## 🎯 Best Practices

1. **Keep PR titles descriptive** using Conventional Commits
2. **Include related issues** in PR description (`fixes #123`)
3. **Test locally** before pushing (`npm test`, `npx tsc --noEmit`)
4. **Update documentation** when making significant changes
5. **Monitor workflow logs** if checks fail

## ❓ Need Help?

- Check the [Contributing Guide](../../CONTRIBUTING.md)
- Review our [Code of Conduct](../../CODE_OF_CONDUCT.md)
- Open an issue for questions or concerns
