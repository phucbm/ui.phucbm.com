# Quick Reference Guide

## Most Important Files to Know

### Registry Build System
- `scripts/index-registry.ts` - Main registry builder (discovery → transformation → publishing)
- `scripts/clean-example-registry.ts` - Cleanup temporary transformed files
- `package.json` - Build scripts, dependencies

### Component Registry
- `registry/phucbm/blocks/{name}/` - Source components
- `registry/phucbm/blocks/{name}/registry-item.json` - Component metadata
- `public/r/` - Published registry JSONs (generated)

### Documentation
- `content/components/` - MDX documentation files
- `content-draft/` - Draft documentation
- `mdx-components.tsx` - Custom MDX component definitions

### Page Rendering
- `app/layout.tsx` - Root layout
- `app/(docs)/layout.tsx` - Docs layout with Nextra
- `app/(docs)/[[...mdxPath]]/page.jsx` - Dynamic page handler
- `app/_meta.global.tsx` - Sidebar navigation generator

### Utilities
- `lib/mdx.ts` - MDX file discovery and parsing
- `lib/getComponents.ts` - Aggregate MDX + registry data
- `lib/getComponentPages.tsx` - Generate sidebar structure
- `lib/getRegistryItem.ts` - Load component metadata
- `lib/getSandpackFiles.ts` - Prepare files for code editor
- `lib/getRegistryUrl.ts` - Construct registry URLs

### Interactive Components
- `components/registry-demo.tsx` - Server-side demo component
- `components/sandpack-demo.tsx` - Client-side Sandpack wrapper
- `components/registry-preview.tsx` - Resizable preview panel
- `components/registry-install.tsx` - Installation commands
- `components/registry-props-table.tsx` - Props documentation

## Common Commands

```bash
# Development
pnpm dev                          # Start dev server (http://localhost:3000)

# Building
pnpm build                        # Full build (next + postbuild)
pnpm index-registry               # Rebuild registry only
pnpm index-registry:dry           # Preview registry without writing

# Clean
pnpm clean-example-registry       # Delete temporary .transformed.tsx files
pnpm clean-example-registry --dry # Preview cleanup

# Type checking
pnpm tsc --noEmit                # Check TypeScript (no emit)
```

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LIVE_SITE_URL=https://ui.perxel.com
NEXT_PUBLIC_REGISTRY_FOLDER=r
```

## Directory Structure

```
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout
│   ├── (docs)/                  # Docs route group
│   │   ├── layout.tsx           # Docs layout
│   │   └── [[...mdxPath]]/      # Dynamic pages
│   └── _meta.global.tsx         # Sidebar navigation
│
├── components/                  # React components
│   ├── registry-*.tsx           # Registry UI components
│   ├── sandpack-*.tsx           # Code editor components
│   ├── search.tsx               # Search component
│   └── ui/                      # shadcn components
│
├── lib/                         # Utility functions
│   ├── mdx.ts                   # MDX file handling
│   ├── get*.ts                  # Data loading functions
│   └── getSandpackFiles.ts      # Code editor setup
│
├── registry/phucbm/blocks/      # Source components
│   ├── draw-svg/
│   ├── magnetic/
│   └── ...
│
├── content/components/          # Documentation
│   ├── draw-svg.mdx
│   ├── magnetic.mdx
│   └── ...
│
├── public/r/                    # Published registry (generated)
│   ├── registry.json
│   └── *.json
│
├── scripts/                     # Build scripts
│   ├── index-registry.ts
│   └── clean-example-registry.ts
│
├── next.config.mjs              # Next.js + Nextra config
├── tsconfig.json                # TypeScript config
├── components.json              # shadcn config
└── .env.local                   # Environment variables
```

## Adding a New Component - Checklist

1. Create registry structure:
   ```bash
   mkdir -p registry/phucbm/blocks/my-component
   ```

2. Create `registry-item.json`:
   ```json
   {
     "name": "my-component",
     "type": "registry:component",
     "title": "My Component",
     "description": "...",
     "dependencies": ["react"],
     "files": [{
       "path": "registry/phucbm/blocks/my-component/my-component.tsx",
       "type": "registry:component",
       "target": "components/phucbm/my-component.tsx"
     }]
   }
   ```

3. Create component files:
   - `my-component.tsx` - Main component
   - `example.tsx` - Default example
   - `example-02.tsx` - Additional examples (optional)

4. Create documentation:
   - `content/components/my-component.mdx`

5. Build and test:
   ```bash
   pnpm build
   pnpm dev
   ```

6. Visit: http://localhost:3000/components/my-component

## Important Conventions

### Registry Item Naming
```
Base:      my-component
Example 1: my-component-example
Example 2: my-component-example-02
Example N: my-component-example-{suffix}
```

### MDX Frontmatter
```yaml
---
category: "Category Name"    # For sidebar grouping (required)
tags: ["tag1", "tag2"]      # Metadata tags (optional)
description: "..."           # Override from registry (optional)
order: 1                      # Sort within category (optional)
---
```

### Component File Naming
```
Source:     {name}.tsx
Examples:   example.tsx, example-02.tsx, example-03.tsx
Utilities:  lib/ subdirectory
```

### Import Path Rules
In source components: `@/registry/phucbm/blocks/{name}/{file}`
In examples: Same as source, automatically transformed to `@/components/phucbm/{name}`

## Key Data Flows

### Build Pipeline
```
pnpm build
  → next build              (compiles Next.js)
  → postbuild              (runs after Next.js build)
    → pagefind             (indexes static content)
    → build:registry       (builds component registry)
      → index-registry     (generates registry.json, public/r/)
      → shadcn build       (builds shadcn components)
      → clean-example-registry (removes temp files)
```

### Component Rendering
```
MDX file (.mdx) 
  → Frontmatter (gray-matter)
  → Content + Metadata
  → Rendered with custom components
  → Page displayed in browser
```

### Interactive Demo
```
<RegistryDemo name="component" />
  → getRegistryItem()
  → getSandpackFiles()
  → Sandpack editor + preview
```

### Search System
```
Content pages
  → Pagefind indexes HTML
  → public/_pagefind/ generated
  → Client searches index
```

## Configuration Files

### `next.config.mjs`
- Enables Nextra
- Enables search
- Configures code highlighting (Shiki)
- Turbopack alias configuration

### `tsconfig.json`
- Path alias: `@/*` → project root
- TypeScript 5.9.3 target

### `components.json`
- shadcn UI configuration
- Style: New York
- Icon library: Lucide
- Tailwind CSS setup

### `package.json`
- Dependencies and dev dependencies
- Build and development scripts
- postbuild hooks for registry + search

## TypeScript Interfaces

### RegistryItem
```typescript
{
  name: string;
  type?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}
```

### RegistryFile
```typescript
{
  path: string;
  type?: string;
  target?: string;
  content?: string;  // Added after publishing
}
```

### MdxData
```typescript
{
  name: string;
  filePath: string;
  dir: string;
  content: string;
  frontMatter: PageFrontMatter;
  timestamp: number;
  lastUpdatedTime: string;
  createdTimestamp: number;
  createdTime: string;
}
```

## Troubleshooting

### Registry not updating
- Run `pnpm clean-example-registry` then `pnpm build`
- Check `.env.local` has correct `NEXT_PUBLIC_SITE_URL`
- Verify `registry-item.json` has required `name` field

### Sidebar not showing component
- Ensure MDX file exists in `content/components/`
- Check frontmatter has `category` field
- Run `pnpm build` to regenerate

### Examples not showing in demo
- Verify `example.tsx` exists in registry component folder
- Check import paths use `@/registry/phucbm/blocks/...` format
- Run `pnpm index-registry:dry` to see transformation

### Search not working
- Build must complete (`pnpm build`)
- Check `public/_pagefind/` directory was created
- Refresh browser cache

## Performance Notes

- MDX files loaded at build time (not runtime)
- Registry JSONs generated at build time, served statically
- Sandpack loads files from disk at build time
- Search index generated post-build
- All pages pre-rendered (static generation)

## Related Technologies

- **Next.js 16**: React framework
- **Nextra 4.6**: Documentation framework
- **Sandpack 2.20**: Code editor/preview
- **Pagefind 1.4**: Static search indexing
- **shadcn**: Component library
- **Tailwind CSS 4**: Styling
- **GSAP 3**: Animation library
- **gray-matter**: YAML frontmatter parsing

