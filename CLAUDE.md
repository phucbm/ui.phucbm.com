# Nextra Documentation Site Architecture

## Overview

This is a **Nextra-based documentation site** (Next.js 16 + Nextra 4.6.0) with a sophisticated **component registry system** for shadcn-compatible components. The site combines MDX documentation with interactive code examples using Sandpack.

Key Tech Stack:
- Next.js 16.0.1 with Turbopack
- Nextra 4.6.0 + nextra-theme-docs
- TypeScript 5.9.3
- Tailwind CSS 4.1.17 + PostCSS
- React 19.2.0
- Sandpack 2.20.0 (code editor/preview)
- Pagefind 1.4.0 (search indexing)

---

## Architecture Layers

### 1. Build System & Postbuild Process

**Flow:** `pnpm build` → `next build` → `postbuild` scripts

The build process has critical postbuild steps defined in `package.json`:

```json
"postbuild": "pnpm build:pagefind && pnpm build:registry",
"build:pagefind": "pagefind --site .next/server/app --output-path public/_pagefind",
"build:registry": "pnpm index-registry && pnpm shadcn build && pnpm clean-example-registry"
```

**Postbuild Steps:**
1. **Pagefind**: Generates static search index from `.next/server/app`
2. **Index Registry**: Generates `registry.json` and publishes components to `public/r/`
3. **shadcn build**: Builds shadcn components
4. **Clean Example Registry**: Removes temporary `.transformed.tsx` files

### 2. Registry System Architecture

The registry system has **three layers**:

#### Layer 1: Source Registry (Development)
- Location: `registry/phucbm/blocks/*/`
- Structure per component:
  ```
  registry/phucbm/blocks/draw-svg/
  ├── registry-item.json          (metadata)
  ├── draw-svg.tsx                (main component)
  ├── example.tsx                 (first example)
  ├── example-02.tsx              (second example)
  └── lib/                        (shared utilities)
  ```

- **registry-item.json format:**
  ```json
  {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "draw-svg",
    "type": "registry:component",
    "title": "Draw SVG",
    "description": "...",
    "dependencies": ["react", "gsap", "@gsap/react"],
    "files": [
      {
        "path": "registry/phucbm/blocks/draw-svg/draw-svg.tsx",
        "type": "registry:component",
        "target": "components/phucbm/draw-svg.tsx"
      }
    ]
  }
  ```

- **Key Conventions:**
  - Component files must match their parent directory name
  - Example files: `example.tsx`, `example-01.tsx`, `example-02.tsx` etc.
  - Files without explicit relative paths are resolved relative to the registry-item.json's directory

#### Layer 2: Registry Indexing (Build Time)
- Script: `scripts/index-registry.ts`
- Processes: All `registry-item.json` files
- Generates: `registry.json` (aggregated registry) + `public/r/*.json` (individual items)

**How index-registry.ts Works:**

1. **Discovery Phase**: Walks `registry/` directory finding all `registry-item.json` files
2. **Normalization Phase**: For each item:
   - Normalizes file paths from relative to absolute
   - Discovers example files (`example.tsx`, `example-*.tsx`)
3. **Transformation Phase**: For each example file:
   - Creates a copy with `.transformed.tsx` extension
   - Rewrites imports from registry paths to target paths
   - Example: `@/registry/phucbm/blocks/draw-svg/draw-svg` → `@/components/phucbm/draw-svg`
4. **Generation Phase**: Creates example registry items:
   - Name: `{base-name}-example` or `{base-name}-example-{suffix}`
   - Files: Single example file with target `index.tsx`
   - Dependencies: References the base component via `registryDependencies`
5. **Deduplication & Output**: 
   - Dedupes by name (last one wins)
   - Sorts alphabetically
   - Writes to `registry.json`

**Environment Variables** (from `.env.local`):
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000    # Dev URL
NEXT_PUBLIC_LIVE_SITE_URL=https://ui.perxel.com  # Production URL
NEXT_PUBLIC_REGISTRY_FOLDER=r                 # Folder in public/
```

#### Layer 3: Published Registry (Runtime)
- Location: `public/r/*.json`
- Contains:
  - `registry.json` - Main registry index
  - Individual component JSONs (e.g., `draw-svg.json`, `draw-svg-example.json`)
  - Each includes full `content` field with transpiled source code

**Important:** These files are served statically and can be consumed by shadcn CLI:
```bash
pnpm dlx shadcn@latest add https://ui.perxel.com/r/draw-svg.json
```

### 3. Content Structure

Two directories for MDX documentation:

#### Documentation Files
- Location: `content/components/` (production) + `content-draft/` (drafts)
- Format: `.mdx` files with YAML frontmatter
- Example structure:
  ```
  content/components/
  ├── index.mdx              (overview page)
  ├── draw-svg.mdx          (per-component page)
  ├── magnetic.mdx
  └── ...
  ```

#### Frontmatter Schema
```yaml
---
category: "SVG"           # For sidebar grouping
tags: ["playground", "svg"]  # Metadata
description: "..."        # Optional override
order: 1                   # Sort order in category
---
```

#### MDX Utilities (`lib/mdx.ts`)
- `getMdxFiles(dir)` - List all MDX files in directory
- `getMdxData(fileDir)` - Read single MDX file with frontmatter + timestamps
- `getMdxFile(fileDir)` - Resolve MDX file by directory path
- Uses `gray-matter` to parse YAML frontmatter
- Tracks file creation/update times via git

### 4. App Router & Page Routing

#### Root Layout
- File: `app/layout.tsx`
- Sets up HTML structure, metadata, analytics
- Imports globals CSS

#### Docs Layout
- File: `app/(docs)/layout.tsx`
- Renders Nextra `Layout` component with:
  - Navbar: Logo, branding, navigation
  - Footer: Custom footer component
  - Sidebar: Auto-generated from `_meta.global.tsx`
  - Search: Custom search component with registry awareness
  - Page map: Generated by `getPageMap()` (Nextra function)

#### Dynamic Page Handler
- File: `app/(docs)/[[...mdxPath]]/page.jsx`
- Uses catch-all route: `[[...mdxPath]]` matches any depth
- Key functions:
  - `generateStaticParams()` - Generates static paths for all content
  - `generateMetadata()` - Per-page SEO metadata
  - Uses Nextra's `importPage()` to load MDX files
  - Fetches registry item for component pages
  - Renders copy-to-clipboard buttons for component pages

#### Sidebar Navigation (`_meta.global.tsx`)
- Dynamically generates Nextra meta structure
- Uses `getComponentPages()` to read all component files
- Organizes by category with separators
- Shows "new" badge for recently created components
- Shows "playground" icon for interactive components

### 5. Custom MDX Components

Registered in `mdx-components.tsx`:
- `RegistryDemo` - Interactive Sandpack editor (server component)
- `RegistryInstall` - Copy-paste install commands
- `RegistryPropsTable` - Renders component props table
- `RegistryExample` - Shows specific example
- `OpenInV0Button` - Opens component in v0.dev
- `Components` - Custom component list
- Plus Nextra defaults (Callout, etc.)

### 6. Interactive Demo System

#### RegistryDemo Flow
1. **Server Component** (`components/registry-demo.tsx`):
   - Accepts: name, height, exampleFileName, etc.
   - Fetches: Registry item for the component
   - Returns: `<SandpackDemo />` client component

2. **Sandpack Setup** (`components/sandpack-demo.tsx`):
   - Uses `getSandpackFiles()` to prepare files
   - Sets up Sandpack provider with theme
   - Includes code editor, file explorer, preview
   - Wraps preview in resizable `RegistryPreview`

3. **File Preparation** (`lib/getSandpackFiles.ts`):
   - Reads all registry files from disk
   - Transforms imports: registry paths → target paths
   - Creates file map for Sandpack:
     - `/App.tsx` - Example code (transformed)
     - `/{target}` - Registry files (transformed)
     - `/tsconfig.json` - Build config (auto-generated)

4. **Registry Preview** (`components/registry-preview.tsx`):
   - Client component with ResizablePanel
   - Shows responsive width indicator
   - Supports resizable/non-resizable modes
   - Height customizable via props

### 7. Build Time Data Loading

Key helpers in `lib/`:

- `getRegistryItem(name)` - Loads `registry/phucbm/blocks/{name}/registry-item.json`
- `getRegistryUrl({name})` - Constructs `{SITE_URL}/r/{name}.json`
- `getComponents()` - Loads all MDX + registry items in parallel
- `getComponentPages()` - Generates Nextra meta structure
- `getCodeItemFromPath()` - Reads source files from disk
- `getSandpackFiles()` - Prepares files for Sandpack editor

All use static imports or Node.js `fs` APIs - only run at build/server time.

### 8. Search System

- **Pagefind**: Full-text search index built post-build
- **Custom Search UI** (`components/search.tsx`):
  - Integrates with Pagefind index
  - Shows registry items + documentation pages
  - Links to both component pages and registry URLs

---

## Development Workflow

### Adding a New Component

1. **Create registry item:**
   ```bash
   mkdir -p registry/phucbm/blocks/my-component
   ```

2. **Add registry-item.json:**
   ```json
   {
     "name": "my-component",
     "type": "registry:component",
     "title": "My Component",
     "description": "...",
     "dependencies": ["react"],
     "files": [
       {
         "path": "registry/phucbm/blocks/my-component/my-component.tsx",
         "type": "registry:component",
         "target": "components/phucbm/my-component.tsx"
       }
     ]
   }
   ```

3. **Add component files:**
   - `my-component.tsx` - Main component
   - `example.tsx` - Default example
   - `example-02.tsx` - Optional additional examples

4. **Add documentation:**
   ```bash
   cat > content/components/my-component.mdx << 'EOF'
   ---
   category: "Category Name"
   tags: ["tag1", "tag2"]
   ---
   
   # My Component
   
   <RegistryDemo name="my-component"/>
   <RegistryInstall name="my-component"/>
   <RegistryPropsTable name="my-component"/>
   EOF
   ```

5. **Build & test:**
   ```bash
   pnpm build
   # Registry files appear in public/r/
   pnpm dev
   # Component appears in sidebar and is searchable
   ```

### Running Registry Indexing

Manual commands:
```bash
pnpm index-registry          # Generate registry.json
pnpm index-registry:dry      # Preview (no write)
pnpm clean-example-registry  # Clean temp files
```

---

## Key Files Reference

### Configuration
- `next.config.mjs` - Nextra config, search enabled, code highlighting
- `tsconfig.json` - Path alias: `@/*` maps to project root
- `components.json` - shadcn config (New York style, Lucide icons)
- `.env.local` - Environment variables for URLs

### Scripts
- `scripts/index-registry.ts` - Main registry builder
- `scripts/clean-example-registry.ts` - Cleanup transformed files

### Components
- `mdx-components.tsx` - MDX component registry
- `components/registry-*.tsx` - Registry UI components
- `components/sandpack-demo.tsx` - Interactive editor wrapper

### Content & Data
- `content/components/` - MDX documentation
- `content-draft/` - Draft documentation
- `registry/phucbm/blocks/` - Source components
- `public/r/` - Published registry JSONs

### Utilities
- `lib/mdx.ts` - MDX file discovery/loading
- `lib/getComponents.ts` - Aggregates MDX + registry
- `lib/getSandpackFiles.ts` - Prepares code for editor
- `lib/getComponentPages.tsx` - Generates sidebar structure

---

## Important Patterns & Conventions

### 1. Registry Item Naming
- Base component: `{name}`
- Examples: `{name}-example`, `{name}-example-01`, `{name}-example-02`

### 2. File Organization
- Components organized by namespace: `phucbm/blocks/`, `phucbm/lib/`
- Target paths standardize: `components/phucbm/{name}.tsx`
- All paths use forward slashes (POSIX) internally

### 3. Import Path Transformation
When example files are published:
- **Before:** `@/registry/phucbm/blocks/draw-svg/draw-svg.tsx`
- **After:** `@/components/phucbm/draw-svg.tsx`

This allows Sandpack to work with the transformed paths.

### 4. Registry Dependencies
Example items reference their base via:
```json
"registryDependencies": ["https://ui.perxel.com/r/draw-svg.json"]
```

This chains component installations in shadcn.

### 5. Markdown Metadata
- Uses YAML frontmatter (gray-matter)
- `category` field controls sidebar grouping
- `tags` field enables filtering/search
- `order` field controls sort within category

### 6. Component Props Table
`<RegistryPropsTable name="draw-svg"/>` - Auto-generates props documentation from TypeScript types.

---

## Build Artifacts

After `pnpm build`:

```
.next/                          # Next.js build output
public/r/                       # Published registry
├── registry.json              # Main index
├── draw-svg.json              # Component registry item
├── draw-svg-example.json      # Example variant
└── ... (all components)

public/_pagefind/              # Search index
├── pagefind-entry.json
└── ... (search files)

registry/phucbm/blocks/*/
└── *.transformed.tsx          # Temp files (cleaned by postbuild)
```

---

## Key Insights for Modifications

1. **Registry System is Build-Time**: All registry logic runs during build, outputs to `public/r/`. Changes to components require rebuilds.

2. **Example Files are Transformed**: The `.transformed.tsx` files are intermediates - they get published to `public/r/` with full code embedded, then deleted.

3. **Dynamic Sidebar**: Sidebar is generated from `content/components/` structure + MDX frontmatter. No manual navigation needed.

4. **Dual Input Sources**: Components have both:
   - **MDX files** (documentation, display)
   - **Registry items** (code, examples, metadata)
   
   These are kept in sync manually.

5. **Sandpack Integration**: Interactive editor reads files from disk at build time and embeds them. Each example is a self-contained registry item.

6. **Search is Dual**: 
   - Pagefind indexes MDX content (full-text search)
   - Registry items are manually searchable via custom search UI

---

## Next Steps for Development

- Review `scripts/index-registry.ts` to understand import path transformation logic
- Check `lib/getSandpackFiles.ts` for file preparation details
- Examine `components/sandpack-demo.tsx` for Sandpack configuration
- Test registry publishing with `pnpm dlx shadcn@latest add`
