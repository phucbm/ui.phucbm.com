# Documentation Index

This repository includes comprehensive documentation files created to help Claude instances and developers understand the Nextra documentation site architecture.

## Quick Navigation

### For Quick Tasks
Start here: **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**
- Common commands
- Component addition checklist
- Important file locations
- Troubleshooting guide
- TypeScript interfaces

### For Deep Understanding
Read: **[CLAUDE.md](./CLAUDE.md)**
- Complete architecture overview (8 layers)
- Build system explanation
- Registry system details
- Content and page rendering
- Patterns and conventions
- Development workflow

### For Visual Understanding
See: **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)**
- 10 detailed flow diagrams
- Build pipeline visualization
- Registry system layers
- Import transformation process
- Component rendering flow
- Sidebar generation
- Search system
- Data flow summary

## Documentation Structure

```
├── DOCUMENTATION_INDEX.md (this file)
├── CLAUDE.md              (comprehensive guide - START HERE for deep dive)
├── ARCHITECTURE_DIAGRAMS.md (visual flows - START HERE for visual learners)
└── QUICK_REFERENCE.md     (fast lookup - START HERE for quick tasks)
```

## Common Starting Points

### I want to...

**Add a new component**
→ Read: QUICK_REFERENCE.md → "Adding a New Component - Checklist"

**Understand the build system**
→ Read: CLAUDE.md → "1. Build System & Postbuild Process"
→ See: ARCHITECTURE_DIAGRAMS.md → "1. Build Pipeline"

**Understand the registry system**
→ Read: CLAUDE.md → "2. Registry System Architecture"
→ See: ARCHITECTURE_DIAGRAMS.md → "2. Registry System - Three Layers"

**Fix a broken sidebar**
→ Read: QUICK_REFERENCE.md → "Troubleshooting"
→ Read: CLAUDE.md → "4. App Router & Page Routing"

**Understand how examples work**
→ Read: CLAUDE.md → "Registry System Architecture" → "Layer 2"
→ See: ARCHITECTURE_DIAGRAMS.md → "4. Import Path Transformation"

**Troubleshoot search**
→ Read: QUICK_REFERENCE.md → "Troubleshooting" → "Search not working"
→ Read: CLAUDE.md → "8. Search System"
→ See: ARCHITECTURE_DIAGRAMS.md → "8. Search System"

**Understand Sandpack integration**
→ Read: CLAUDE.md → "6. Interactive Demo System"
→ See: ARCHITECTURE_DIAGRAMS.md → "6. RegistryDemo Component Flow"

## Key Concepts Overview

### The Three-Layer Registry System

**Layer 1: Source (You modify these)**
- Location: `registry/phucbm/blocks/{name}/`
- Contains: `registry-item.json`, component files, examples

**Layer 2: Processing (Automatic at build time)**
- Reads Layer 1 files
- Transforms import paths
- Generates example variants
- Creates temporary `.transformed.tsx` files

**Layer 3: Published (Generated, read-only)**
- Location: `public/r/*.json`
- Contains: Full component source code with transformed imports
- Used by: shadcn CLI and custom UIs

### The Build Flow

```
pnpm build
  → next build
  → postbuild
    → pagefind (search indexing)
    → build:registry
      → index-registry (Layer 1 → Layer 3)
      → shadcn build
      → clean-example-registry (removes Layer 2 temp files)
```

### The Documentation Flow

```
content/components/XXX.mdx
  → Parsed with gray-matter (YAML frontmatter)
  → Metadata (category, tags, etc.)
  → Rendered with custom MDX components
  → Sidebar auto-generated from categories
```

## File Locations

### Essential Files
| Purpose | Location |
|---------|----------|
| Registry builder | `scripts/index-registry.ts` |
| Registry cleanup | `scripts/clean-example-registry.ts` |
| MDX utilities | `lib/mdx.ts` |
| Component aggregation | `lib/getComponents.ts` |
| Sidebar generation | `lib/getComponentPages.tsx` |
| Sandpack setup | `lib/getSandpackFiles.ts` |

### Component Locations
| Type | Location |
|------|----------|
| Source components | `registry/phucbm/blocks/` |
| Documentation | `content/components/` |
| Published registry | `public/r/` |
| UI components | `components/registry-*.tsx` |
| Custom MDX | `mdx-components.tsx` |

### Configuration Files
| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js + Nextra configuration |
| `tsconfig.json` | TypeScript configuration |
| `components.json` | shadcn UI configuration |
| `.env.local` | Environment variables |
| `package.json` | Dependencies and build scripts |

## Important Conventions

### Component Naming
```
Source:        my-component
Examples:      my-component-example, my-component-example-02
```

### Registry Item.json Structure
```json
{
  "name": "my-component",
  "title": "My Component",
  "description": "...",
  "type": "registry:component",
  "dependencies": ["react"],
  "files": [{
    "path": "registry/phucbm/blocks/my-component/my-component.tsx",
    "target": "components/phucbm/my-component.tsx"
  }]
}
```

### MDX Frontmatter
```yaml
---
category: "Category Name"     # Required for sidebar
tags: ["tag1", "tag2"]       # Optional
description: "..."            # Optional override
order: 1                       # Optional sort order
---
```

### Import Path Rules
- Source examples: `@/registry/phucbm/blocks/{name}/{file}`
- Auto-transformed to: `@/components/phucbm/{name}`
- Transformation happens in `scripts/index-registry.ts`

## Troubleshooting Quick Links

**Issue** → **Solution**

Components not appearing in registry
→ QUICK_REFERENCE.md → "Troubleshooting" → "Registry not updating"

Sidebar not showing new component
→ QUICK_REFERENCE.md → "Troubleshooting" → "Sidebar not showing component"

Examples not showing in demo
→ QUICK_REFERENCE.md → "Troubleshooting" → "Examples not showing in demo"

Search not working
→ QUICK_REFERENCE.md → "Troubleshooting" → "Search not working"

## Technology Stack

- **Framework**: Next.js 16.0.1 (Turbopack)
- **Docs**: Nextra 4.6.0
- **React**: 19.2.0
- **Editor**: Sandpack 2.20.0
- **Search**: Pagefind 1.4.0
- **Styling**: Tailwind CSS 4.1.17, shadcn UI
- **Content**: gray-matter, Shiki
- **Animation**: GSAP 3.13.0

## Development Workflow

1. **Add component files** in `registry/phucbm/blocks/my-component/`
2. **Create registry-item.json** with metadata
3. **Create examples** (example.tsx, example-02.tsx)
4. **Create documentation** in `content/components/my-component.mdx`
5. **Run `pnpm build`** to generate registry
6. **Run `pnpm dev`** to preview
7. **Commit** to git

See QUICK_REFERENCE.md → "Adding a New Component - Checklist" for detailed steps.

## Document Metadata

| Document | Lines | Size | Created |
|----------|-------|------|---------|
| CLAUDE.md | 433 | 14KB | Nov 13, 2024 |
| ARCHITECTURE_DIAGRAMS.md | 500 | 17KB | Nov 13, 2024 |
| QUICK_REFERENCE.md | 325 | 8.8KB | Nov 13, 2024 |
| **Total** | **1,258** | **40KB** | |

## Git Commits

```
5f6707c docs: add quick reference guide
893d473 docs: add architecture diagrams and flow charts
932fc73 docs: add comprehensive architecture guide for Claude
```

## Tips for Using These Documents

1. **Bookmark the section titles** - Use Ctrl+F to search
2. **Use QUICK_REFERENCE.md for fast lookups**
3. **Use ARCHITECTURE_DIAGRAMS.md when confused about flow**
4. **Use CLAUDE.md for complete understanding**
5. **Combine all three** for complex problems

## Next Actions

- **First time here?** Read QUICK_REFERENCE.md → Overview sections
- **Adding a component?** Follow QUICK_REFERENCE.md → Checklist
- **Modifying build system?** Read CLAUDE.md → "Build System" section
- **Debugging complex issue?** Consult all three documents

---

**Last Updated**: November 13, 2024
**Status**: Complete and committed to git
**For**: Future Claude instances and developers working on this Nextra docs site
