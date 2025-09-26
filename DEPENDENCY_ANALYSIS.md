# Dependency Analysis Report

## Current State Overview
- **Node.js**: 14.5.0 → **Target**: 20.x
- **React**: 16.8.0 → **Target**: 18.x.x
- **Webpack**: 4.43.0 → **Target**: 5.x.x
- **Babel**: 6.x.x (legacy) → **Target**: 7.x.x

## Critical Dependencies Requiring Updates

### Core Framework (HIGH PRIORITY)
- ✋ **react**: 16.8.0 → ^18.2.0
- ✋ **react-dom**: 16.8.0 → ^18.2.0
- ✋ **react-router-dom**: ^4.2.2 → ^6.x.x

### Build Tools (HIGH PRIORITY)
- ⚠️ **webpack**: ^4.43.0 → ^5.x.x
- ⚠️ **webpack-cli**: ^3.3.12 → ^5.x.x
- ⚠️ **webpack-dev-server**: ^3.11.0 → ^4.x.x
- ❌ **extract-text-webpack-plugin**: ^4.0.0-beta.0 → **REPLACE** with mini-css-extract-plugin

### Babel Ecosystem (CRITICAL - All Legacy)
- ❌ **babel-core**: 6.25.0 → **REPLACE** with @babel/core: ^7.x.x
- ❌ **babel-cli**: 6.24.1 → **REPLACE** with @babel/cli: ^7.x.x
- ❌ **babel-loader**: ^7.1.4 → ^9.x.x
- ❌ **babel-preset-env**: 1.5.2 → **REPLACE** with @babel/preset-env: ^7.x.x
- ❌ **babel-preset-react**: 6.24.1 → **REPLACE** with @babel/preset-react: ^7.x.x
- ❌ **babel-preset-es2015**: ^6.24.1 → **REMOVE** (included in preset-env)
- ❌ **babel-preset-stage-0/2**: ^6.x.x → **REMOVE** (deprecated)

### React Ecosystem Updates
- 🔄 **react-redux**: ^5.0.7 → ^8.x.x
- 🔄 **redux**: ^4.0.5 → ^4.2.x (latest)
- 🔄 **react-helmet**: ^5.2.0 → ^6.x.x
- 🔄 **react-modal**: ^3.4.4 → ^3.16.x

### Deprecated React Packages (REMOVE)
- ❌ **react-addons-css-transition-group**: ^15.6.2 → **REMOVE** (use react-transition-group)
- ❌ **react-addons-shallow-compare**: ^15.6.2 → **REMOVE** (built into React)
- ❌ **react-addons-transition-group**: ^15.6.2 → **REMOVE** (use react-transition-group)

### Testing Framework (CRITICAL)
- ❌ **enzyme**: ^3.3.0 → **REPLACE** with @testing-library/react
- ❌ **enzyme-adapter-react-16**: ^1.1.1 → **REMOVE**
- ❌ **enzyme-to-json**: ^3.3.4 → **REMOVE**
- 🔄 **jest**: ^23.1.0 → ^29.x.x
- 🔄 **react-test-renderer**: ^16.4.0 → ^18.x.x

### Styling & CSS
- 🔄 **css-loader**: ^0.28.11 → ^6.x.x
- 🔄 **sass**: ^1.26.10 → ^1.69.x
- 🔄 **sass-loader**: ^9.0.2 → ^13.x.x
- 🔄 **bootstrap**: ^4.1.1 → ^5.x.x

### Utilities & Libraries
- 🔄 **date-fns**: ^2.15.0 → ^2.30.x
- 🔄 **firebase**: ^7.16.1 → ^10.x.x
- 🔄 **firebase-admin**: ^9.0.0 → ^11.x.x
- 🔄 **express**: ^4.16.3 → ^4.18.x
- 🔄 **jquery**: ^3.3.1 → ^3.7.x

## Compatibility Matrix

### React 18 Compatibility
- ✅ **react-redux**: Compatible with React 18
- ✅ **redux**: Compatible
- ⚠️ **react-router-dom**: v4 → v6 (breaking changes)
- ❌ **react-addons-***: Not compatible (deprecated)

### Node 20 Compatibility
- ✅ Most packages compatible
- ⚠️ **sass**: May need native compilation fixes
- ✅ **webpack**: v5 supports Node 20

## Risk Assessment

### HIGH RISK (Breaking Changes Expected)
1. **React Router**: v4 → v6 (major API changes)
2. **Webpack**: v4 → v5 (configuration changes)
3. **Babel**: v6 → v7 (configuration overhaul)
4. **Testing**: Enzyme → Testing Library (complete rewrite needed)

### MEDIUM RISK
1. **Bootstrap**: v4 → v5 (CSS class changes)
2. **Firebase**: v7 → v10 (API updates)
3. **React Addons**: Removal requires refactoring

### LOW RISK
1. **Date-fns**: Backward compatible
2. **Express**: Minor version updates
3. **Utility libraries**: Generally stable

## Replacement Strategy

### Immediate Replacements Needed
1. **extract-text-webpack-plugin** → **mini-css-extract-plugin**
2. **react-addons-css-transition-group** → **react-transition-group**
3. **enzyme** → **@testing-library/react**
4. **babel 6.x** → **@babel/* 7.x**

### TypeScript Additions Required
- **typescript**: ^5.x.x
- **@types/react**: ^18.x.x
- **@types/react-dom**: ^18.x.x
- **@types/node**: ^20.x.x
- **ts-loader**: ^9.x.x

## Estimated Update Time: 4-6 hours
- Phase 1.2 (Core): 2 hours
- Phase 1.3 (Build tools): 1.5 hours
- Phase 1.4 (Testing): 1 hour
- Phase 1.5 (Others): 1 hour
- Buffer for fixes: 0.5-1.5 hours