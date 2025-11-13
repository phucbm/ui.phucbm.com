# Architecture Diagrams & Flow Charts

## 1. Build Pipeline

```
pnpm build
    |
    v
next build (.next/)
    |
    v
postbuild: pnpm build:pagefind && pnpm build:registry
    |
    +---> Pagefind
    |     scanindex .next/server/app -> public/_pagefind/
    |     (Full-text search index)
    |
    +---> build:registry
          |
          +---> pnpm index-registry
          |     scripts/index-registry.ts processes:
          |     - registry/phucbm/blocks/*/registry-item.json
          |     - Creates *.transformed.tsx for examples
          |     - Outputs: registry.json + public/r/*.json
          |
          +---> pnpm shadcn build
          |     (Builds shadcn components)
          |
          +---> pnpm clean-example-registry
                (Deletes *.transformed.tsx temp files)
```

---

## 2. Registry System - Three Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 1: SOURCE REGISTRY (Development - Read/Write)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  registry/phucbm/blocks/draw-svg/                                   │
│  ├── registry-item.json                                             │
│  ├── draw-svg.tsx                    (main component)               │
│  ├── example.tsx                     (example 1)                    │
│  ├── example-02.tsx                  (example 2)                    │
│  └── lib/                            (shared utilities)             │
│                                                                       │
│  registry/phucbm/blocks/magnetic/                                   │
│  ├── registry-item.json                                             │
│  ├── magnetic.tsx                                                   │
│  └── example.tsx                                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                        ↓ (Build Time)
                scripts/index-registry.ts
                    (Transform & Generate)
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 2: PROCESSING (Build Time Only)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  registry/phucbm/blocks/*/                                          │
│  ├── example.transformed.tsx        (temp: transformed imports)     │
│  └── example-02.transformed.tsx     (temp: transformed imports)     │
│                                                                       │
│  registry.json (aggregated, all items)                              │
│                                                                       │
│  Processing Steps:                                                   │
│  1. Discovery: Find all registry-item.json files                   │
│  2. Normalization: Resolve relative paths to absolute              │
│  3. Transformation: Rewrite imports in example files               │
│  4. Generation: Create example variants with dependencies          │
│  5. Deduplication: Merge base + examples, sort                     │
│  6. Output: Write registry.json + individual JSONs                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                        ↓ (Published)
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 3: PUBLISHED REGISTRY (Runtime - Static Files)                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  public/r/                                                           │
│  ├── registry.json                  (main index, all items)        │
│  ├── draw-svg.json                  (includes content field)       │
│  ├── draw-svg-example.json          (includes content field)       │
│  ├── draw-svg-example-02.json                                       │
│  ├── magnetic.json                                                  │
│  ├── magnetic-example.json                                          │
│  └── ... (one JSON per registry item)                              │
│                                                                       │
│  Served as: https://ui.perxel.com/r/{name}.json                    │
│  Consumed by: shadcn CLI, custom UIs                                │
│                                                                       │
│  Example Usage:                                                      │
│  pnpm dlx shadcn@latest add https://ui.perxel.com/r/draw-svg.json  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Registry Item Structure

```
registry-item.json (Source)
    {
        "name": "draw-svg",
        "type": "registry:component",
        "title": "Draw SVG",
        "description": "Animate SVG path drawing",
        "dependencies": ["react", "gsap"],
        "files": [
            {
                "path": "registry/phucbm/blocks/draw-svg/draw-svg.tsx",
                "target": "components/phucbm/draw-svg.tsx"
            }
        ]
    }
              ↓
    scripts/index-registry.ts
              ↓
public/r/draw-svg.json (Published)
    {
        "name": "draw-svg",
        "type": "registry:component",
        "files": [
            {
                "path": "registry/phucbm/blocks/draw-svg/draw-svg.tsx",
                "content": "\"use client\";...full source code...",
                "target": "components/phucbm/draw-svg.tsx"
            }
        ]
    }

public/r/draw-svg-example.json (Generated)
    {
        "name": "draw-svg-example",
        "type": "registry:component",
        "registryDependencies": [
            "https://ui.perxel.com/r/draw-svg.json"
        ],
        "files": [
            {
                "path": "registry/phucbm/blocks/draw-svg/example.transformed.tsx",
                "content": "\"use client\";...transformed example code...",
                "target": "index.tsx"
            }
        ]
    }
```

---

## 4. Import Path Transformation

```
Step 1: Source File (example.tsx)
────────────────────────────────
import { DrawSVG } from "@/registry/phucbm/blocks/draw-svg/draw-svg"
import { gsap } from "gsap"

export default function Example() {
    return <DrawSVG>...</DrawSVG>
}

Step 2: Discovery
────────────────
registry-item.json specifies:
  path: "registry/phucbm/blocks/draw-svg/draw-svg.tsx"
  target: "components/phucbm/draw-svg.tsx"

Regex Pattern Created:
  FROM: @/registry/phucbm/blocks/draw-svg/draw-svg
  TO:   @/components/phucbm/draw-svg

Step 3: Transformation (scripts/index-registry.ts)
──────────────────────────────────
Create: example.transformed.tsx
Content:
import { DrawSVG } from "@/components/phucbm/draw-svg"
import { gsap } from "gsap"

export default function Example() {
    return <DrawSVG>...</DrawSVG>
}

Step 4: Publishing
──────────────────
public/r/draw-svg-example.json includes:
{
    "content": "import { DrawSVG } from \"@/components/phucbm/draw-svg\"..."
}

Step 5: Cleanup
───────────────
scripts/clean-example-registry.ts deletes:
- registry/phucbm/blocks/draw-svg/example.transformed.tsx
- registry/phucbm/blocks/draw-svg/example-02.transformed.tsx
```

---

## 5. Content to Page Flow

```
content/components/draw-svg.mdx
┌─────────────────────────────────────┐
│ ---                                 │
│ category: "SVG"                    │
│ tags: ["playground", "svg"]        │
│ ---                                 │
│                                     │
│ # Draw SVG                          │
│ <RegistryDemo name="draw-svg"/>    │
│ <RegistryInstall name="draw-svg"/> │
│ <RegistryPropsTable ... />         │
└─────────────────────────────────────┘
            ↓
lib/mdx.ts: getMdxData()
    - Parse YAML frontmatter (gray-matter)
    - Extract content
    - Get file timestamps
            ↓
lib/getComponents()
    - Load MDX files
    - Load registry items in parallel
    - Merge metadata
            ↓
app/_meta.global.tsx: getComponentPages()
    - Group by category
    - Sort within categories
    - Generate Nextra MetaRecord
            ↓
app/(docs)/layout.tsx
    - Pass pageMap to Nextra Layout
    - Renders sidebar with categories
            ↓
app/(docs)/[[...mdxPath]]/page.jsx
    - importPage() loads MDX
    - getRegistryItem() loads component metadata
    - Renders MDX content with custom components
            ↓
Browser: /components/draw-svg
    ├── Sidebar shows category structure
    ├── Page renders markdown + custom components
    ├── <RegistryDemo> → Sandpack editor
    ├── <RegistryInstall> → Copy-paste commands
    └── <RegistryPropsTable> → Auto-generated props
```

---

## 6. RegistryDemo Component Flow

```
MDX Page:  <RegistryDemo name="draw-svg" />
            ↓
components/registry-demo.tsx (Server)
    - getRegistryItem("draw-svg")
    - Returns registry metadata
            ↓
components/sandpack-demo.tsx (Client)
    - getSandpackFiles(registryItem)
            ↓
lib/getSandpackFiles.ts
    ┌─────────────────────────────────────┐
    │ For each file in registryItem:     │
    │ 1. Read from disk                   │
    │ 2. Transform imports                │
    │ 3. Build SandpackFiles object      │
    │                                      │
    │ Result:                             │
    │ {                                   │
    │   "/App.tsx": transformed example  │
    │   "/components/phucbm/draw-svg.tsx"│
    │   "/tsconfig.json": auto-generated  │
    │ }                                   │
    └─────────────────────────────────────┘
            ↓
components/sandpack-demo.tsx
    ┌─────────────────────────────────────┐
    │ <SandpackProvider files={...}>     │
    │   <SandpackLayout>                 │
    │     <SandpackFileExplorer />       │
    │     <SandpackCodeEditor />         │
    │     <RegistryPreview>              │
    │       <SandpackPreview />          │
    │     </RegistryPreview>             │
    │   </SandpackLayout>                │
    │ </SandpackProvider>                │
    └─────────────────────────────────────┘
            ↓
Browser: Interactive Editor
    ├── Left: Code editor (editable)
    ├── Right: Live preview (resizable)
    └── Bottom: File explorer (optional)
```

---

## 7. Sidebar Navigation Generation

```
content/components/
├── draw-svg.mdx    (category: "SVG")
├── magnetic.mdx    (category: "Animation")
├── text-ripple.mdx (category: "Text")
└── word-by-word.mdx (category: "Text")

    ↓

lib/getComponentPages()
    1. getMdxFiles("content/components")
    2. For each file: getMdxData()
    3. Extract frontMatter.category
    4. Group by category
    5. Sort categories alphabetically
    6. Sort pages within category by order
    7. Build MetaRecord:

{
    "---Animation": {
        type: "separator",
        title: "Animation"
    },
    "magnetic": { ... },
    "---SVG": {
        type: "separator",
        title: "SVG"
    },
    "draw-svg": { ... },
    "---Text": {
        type: "separator",
        title: "Text"
    },
    "text-ripple": { ... },
    "word-by-word": { ... }
}

    ↓

Sidebar Display:
    Animation
        ├── Magnetic
        └── ...
    SVG
        ├── Draw SVG
        └── ...
    Text
        ├── Text Ripple
        └── Word by Word
```

---

## 8. Search System

```
Public Documentation Pages
├── /
├── /components/draw-svg
├── /components/magnetic
└── /components/...

    ↓ (Post-build)

scripts/pagefind integration:
    pagefind --site .next/server/app
    Indexes all HTML content from build
    Outputs: public/_pagefind/

    ↓

public/_pagefind/ (Static Assets)
├── pagefind-entry.json
├── ... (search index files)

    ↓

components/search.tsx (Client)
    - Integrates Pagefind index
    - Shows search results
    - Links to documentation pages
    - Also shows registry components

Browser Search Flow:
    User types in search
        ↓
    Pagefind searches index
        ↓
    Results include:
    - MDX documentation pages
    - Custom registry items
        ↓
    Click → Navigate to component page
```

---

## 9. Development Workflow

```
Add New Component
    ↓
mkdir -p registry/phucbm/blocks/my-component
    ↓
Create files:
    my-component.tsx (main)
    example.tsx      (example 1)
    registry-item.json
    ↓
Create documentation:
    content/components/my-component.mdx
    ↓
pnpm build
    ↓
    ├─→ next build
    │   └─→ Processes MDX files
    │       Generates static pages
    │
    └─→ postbuild
        ├─→ pagefind
        │   └─→ Indexes .next/server/app
        │       Creates public/_pagefind/
        │
        └─→ build:registry
            ├─→ index-registry
            │   ├─→ Find registry-item.json files
            │   ├─→ Create *.transformed.tsx
            │   ├─→ Transform imports
            │   ├─→ Create example items
            │   ├─→ Write registry.json
            │   └─→ Write public/r/*.json
            │
            ├─→ shadcn build
            │
            └─→ clean-example-registry
                └─→ Delete *.transformed.tsx
    ↓
pnpm dev
    ↓
Browser: http://localhost:3000/components/my-component
    ├─ Page renders
    ├─ Sidebar shows new component
    ├─ <RegistryDemo> works
    └─ Search finds component
```

---

## 10. Data Flow Summary

```
Input Sources (Development)
    ├── registry/phucbm/blocks/*/
    │   ├── registry-item.json
    │   ├── {name}.tsx
    │   └── example*.tsx
    │
    └── content/components/
        └── {name}.mdx

    ↓

Build Time Processing
    ├── lib/mdx.ts
    │   └─→ Discover & parse MDX files
    │
    ├── lib/getComponents()
    │   └─→ Load MDX + registry in parallel
    │
    ├── scripts/index-registry.ts
    │   └─→ Transform imports, generate examples
    │
    └── app/_meta.global.tsx
        └─→ Build sidebar structure

    ↓

Generated Artifacts
    ├── .next/
    │   └─→ Next.js build output
    │
    ├── public/r/
    │   ├── registry.json
    │   └── *.json (individual items)
    │
    └── public/_pagefind/
        └─→ Search index

    ↓

Runtime (Browser)
    ├── Static HTML pages
    ├── Search functionality
    ├── Sandpack code editor
    └── Navigation sidebar
```

