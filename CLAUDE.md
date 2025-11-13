# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Nextra-based documentation site (Next.js 16 + Nextra 4.6) with a sophisticated component registry system for shadcn-compatible components. The site combines MDX documentation with interactive code examples using Sandpack.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Nextra 4.6, Tailwind CSS 4, Sandpack 2.20, Pagefind 1.4

## Development Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack

# Building
pnpm build                  # Full build (Next.js + postbuild steps)
pnpm start                  # Production server

# Registry Operations
pnpm index-registry         # Generate registry.json and publish to public/r/
pnpm index-registry:dry     # Preview registry generation (no write)
pnpm clean-example-registry # Remove temp .transformed.tsx files

# Individual Build Steps (normally run via postbuild)
pnpm build:pagefind        # Generate search index
pnpm build:registry        # Build registry (index + shadcn + clean)
```

## Architecture Overview

### Three-Layer Registry System

The core architecture revolves around a registry system with three distinct layers:

**Layer 1: Source Registry** (`registry/phucbm/blocks/`)
- Each component has its own directory with:
  - `registry-item.json` - Metadata and configuration
  - `{name}.tsx` - Main component file (must match directory name)
  - `example.tsx`, `example-02.tsx`, etc. - Example files
  - `lib/` - Optional shared utilities

**Layer 2: Build-Time Processing** (`scripts/index-registry.ts`)
- Discovers all `registry-item.json` files
- Transforms import paths from registry paths to target paths
  - From: `@/registry/phucbm/blocks/draw-svg/draw-svg`
  - To: `@/components/phucbm/draw-svg`
- Creates separate registry items for each example file
  - Base: `my-component`
  - Examples: `my-component-example`, `my-component-example-02`
- Generates `registry.json` (aggregated) and individual JSON files

**Layer 3: Published Registry** (`public/r/`)
- Static JSON files served at runtime
- Each includes full transpiled source code in `content` field
- Consumable via: `pnpm dlx shadcn@latest add https://ui.phucbm.com/r/{name}.json`

### Build Pipeline

```
pnpm build
  ↓
next build (generates .next/)
  ↓
postbuild (automatic)
  ↓
  ├─ build:pagefind → Creates search index in public/_pagefind/
  └─ build:registry → index-registry + shadcn build + clean
```

**Critical:** Changes to components require a full `pnpm build` to regenerate the registry.

### Content Structure

**MDX Documentation:**
- `content/components/*.mdx` - Production docs
- `content-draft/*.mdx` - Draft documentation

**Frontmatter Schema:**
```yaml
---
category: "SVG"              # Sidebar grouping
tags: ["playground", "svg"]  # Metadata/filtering
description: "..."           # Optional override
order: 1                     # Sort order in category
---
```

**Sidebar Generation:**
- Auto-generated from MDX files via `app/(docs)/_meta.global.tsx`
- Uses `getComponentPages()` to read all component files
- Organizes by category with separators
- Shows "new" badge for recently created components (<7 days)

### App Router Structure

```
app/
├── layout.tsx                          # Root layout
├── (docs)/
│   ├── layout.tsx                     # Nextra layout wrapper
│   ├── _meta.global.tsx              # Sidebar navigation config
│   └── [[...mdxPath]]/page.jsx       # Catch-all MDX handler
```

**Key Route Features:**
- `[[...mdxPath]]` matches any depth for MDX files
- `generateStaticParams()` creates static paths for all content
- Uses Nextra's `importPage()` to load MDX dynamically
- Fetches registry data for component pages

### Interactive Demo System

**RegistryDemo Flow:**
1. MDX contains: `<RegistryDemo name="draw-svg"/>`
2. Server component fetches registry item from disk
3. `getSandpackFiles()` prepares file map with transformed imports
4. `<SandpackDemo />` client component renders Sandpack editor
5. Preview wrapped in `<RegistryPreview />` with resize controls

**Sandpack File Preparation:**
- `/App.tsx` - Example code (transformed imports)
- `/{target-path}` - Component files (transformed imports)
- `/tsconfig.json` - Auto-generated build config

## Key Files Reference

### Configuration
- `next.config.mjs` - Nextra config, search enabled, MDX options
- `tsconfig.json` - Path aliases (`@/*` → project root)
- `components.json` - shadcn config (New York style, Lucide icons)
- `.env.local` - Environment variables (NEXT_PUBLIC_SITE_URL, etc.)

### Scripts
- `scripts/index-registry.ts` - Registry builder (discovery → transformation → output)
- `scripts/clean-example-registry.ts` - Removes `.transformed.tsx` temp files

### Core Libraries
- `lib/mdx.ts` - MDX file discovery/loading with gray-matter
- `lib/getComponents.ts` - Aggregates MDX + registry data
- `lib/getSandpackFiles.ts` - Prepares files for Sandpack editor
- `lib/getComponentPages.tsx` - Generates sidebar structure
- `lib/getRegistryItem.ts` - Loads registry items from disk

### Custom MDX Components
Registered in `mdx-components.tsx`:
- `<RegistryDemo />` - Interactive Sandpack editor
- `<RegistryInstall />` - Copy-paste install commands
- `<RegistryPropsTable />` - Auto-generates props table from TypeScript
- `<RegistryExample />` - Shows specific example variant
- `<OpenInV0Button />` - Opens component in v0.dev

## Adding a New Component

1. **Create registry structure:**
   ```bash
   mkdir -p registry/phucbm/blocks/my-component
   cd registry/phucbm/blocks/my-component
   ```

2. **Add `registry-item.json`:**
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema/registry-item.json",
     "name": "my-component",
     "type": "registry:component",
     "title": "My Component",
     "description": "Component description",
     "dependencies": ["react"],
     "files": [{
       "path": "registry/phucbm/blocks/my-component/my-component.tsx",
       "type": "registry:component",
       "target": "components/phucbm/my-component.tsx"
     }]
   }
   ```

3. **Create component files:**
   - `my-component.tsx` - Main component (name must match directory)
   - `example.tsx` - Default example
   - `example-02.tsx` - Additional examples (optional)

4. **Add MDX documentation:**
   ```bash
   cat > content/components/my-component.mdx << 'EOF'
   ---
   category: "Category Name"
   tags: ["tag1"]
   ---

   # My Component

   <RegistryDemo name="my-component"/>
   <RegistryInstall name="my-component"/>
   <RegistryPropsTable name="my-component"/>
   EOF
   ```

5. **Build and verify:**
   ```bash
   pnpm build                    # Generates public/r/my-component.json
   pnpm dev                      # Component appears in sidebar
   ```

## Important Patterns

### Registry Item Naming Convention
- Base component: `{name}`
- First example: `{name}-example`
- Additional: `{name}-example-01`, `{name}-example-02`

### Import Path Transformation
Example files are automatically transformed during build:
- **Source:** `import { DrawSvg } from "@/registry/phucbm/blocks/draw-svg/draw-svg"`
- **Published:** `import { DrawSvg } from "@/components/phucbm/draw-svg"`

This ensures Sandpack can resolve imports correctly.

### Registry Dependencies
Example items automatically reference their base component:
```json
"registryDependencies": ["https://ui.phucbm.com/r/draw-svg.json"]
```

### File Path Resolution
Paths in `registry-item.json` without explicit relative prefixes are resolved relative to the JSON file's directory.

## Environment Variables

Located in `.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LIVE_SITE_URL=https://ui.phucbm.com
NEXT_PUBLIC_REGISTRY_FOLDER=r
```

## Build Artifacts

After `pnpm build`:
```
.next/                      # Next.js build output
public/r/                   # Published registry
├── registry.json          # Main index
├── {name}.json           # Component registry items
└── {name}-example.json   # Example variants

public/_pagefind/          # Search index
registry/**/*.transformed.tsx  # Temp files (auto-cleaned)
```

## Key Architecture Insights

1. **Registry is Build-Time:** All registry logic runs during build. Component changes require `pnpm build`.

2. **Dual Data Sources:** Components have both MDX files (documentation) and registry items (code/examples). These must be kept in sync manually.

3. **Example Transformation:** Example files are copied, imports are rewritten, and published as separate registry items with the main component as a dependency.

4. **Dynamic Sidebar:** Navigation is auto-generated from `content/components/` structure and MDX frontmatter. No manual configuration needed.

5. **Search is Dual:**
   - Pagefind indexes MDX content (full-text search)
   - Custom search UI shows registry items

6. **Sandpack Integration:** Interactive editor embeds transformed files at build time. Each example is self-contained.
