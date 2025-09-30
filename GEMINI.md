# Gemini Code Instructions

## Project Context
This is a React web application currently being modernized from React 16.8 to React 18, with full TypeScript migration and component refactoring.

## Key Instructions
1. **Always read PLAN.md first** - Contains the detailed modernization plan with steps and time estimates
2. **Update PROGRESS.md** - Keep track of completed tasks and current status
3. **Use the TodoWrite tool** - Maintain task tracking throughout the session
4. **Follow the migration phases** - Work through the plan systematically:
   - Phase 1: Dependency Updates
   - Phase 2: TypeScript Setup
   - Phase 3: File Conversion (.js → .ts/.tsx)
   - Phase 4: Component Refactoring (Class → Functional)
   - Phase 5: Logic & Design Extraction
   - Phase 6: Testing & QA

## Branching Strategy
- **Main codebase**: `master` branch
- **Working refactored version**: `dev` branch
- **Current development phase**: `gem` branch (created from `dev`)
- **Feature work**: Create individual branches from the `gem` branch for each step.

### Workflow for Each Step:
1. **Create feature branch** from the `gem` branch for each step in PLAN.md.
   - Use descriptive names like `step-5.1-extract-logic`.
2. **Complete the step** on the feature branch.
3. **Push feature branch** to GitHub when ready (use `git push -u origin <branch-name>` to set up tracking).
4. **Verify Changes**: Before creating a pull request, run the development server (`yarn dev-server &`) to ensure the changes work as expected. The `&` is important as it runs the server as a background process. Suggest which website pages should be manually checked for potential bugs based on the changes made.
5. **Create Pull Request** to merge the feature branch back into the `gem` branch.
6. **Wait for approval** - Do not merge without user approval.
7. **After PR is approved and merged**:
   - Checkout the `gem` branch.
   - Pull the latest changes to the `gem` branch.
   - Update PROGRESS.md with the completed step.
   - Continue to the next step.

### Branch Naming Convention:
- `step-X.Y-brief-description` (e.g., `step-1.2-update-core-deps`)
- `phase-X-description` for larger phases
- Always branch from current `dev` state

## Key Files
- `PLAN.md` - Detailed modernization plan (READ THIS FIRST)
- `PROGRESS.md` - Current progress tracking
- `UPGRADE.md` - Technical upgrade documentation
- `package.json` - Dependencies (currently React 16.8, Node 14.5)

## Build Commands
- `yarn run build:dev` - Development build
- `yarn run build:prod` - Production build
- `yarn start` - Start development server

## Deployment
- GitHub: `origin` remote
- Heroku: `heroku` remote (production deployment)

## Notes
- Documentation files (PLAN.md, PROGRESS.md, etc.) are in .gitignore
- Always test builds after major changes
- Maintain backward compatibility during migration