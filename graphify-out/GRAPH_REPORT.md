# Graph Report - .  (2026-05-12)

## Corpus Check
- 116 files · ~149,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1242 nodes · 1279 edges · 97 communities (74 shown, 23 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 64 edges
2. `calculateFSI()` - 9 edges
3. `main()` - 6 edges
4. `handleClick()` - 6 edges
5. `extractCodeBlocks()` - 6 edges
6. `extractHelmetData()` - 5 edges
7. `run()` - 4 edges
8. `findImportedComponentNames()` - 4 edges
9. `extractDOMContext()` - 4 edges
10. `createOverlay()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `DialogHeader()` --calls--> `cn()`  [INFERRED]
  web/src/components/ui/dialog.jsx → web/src/lib/utils.js
- `DialogFooter()` --calls--> `cn()`  [INFERRED]
  web/src/components/ui/dialog.jsx → web/src/lib/utils.js
- `MenubarShortcut()` --calls--> `cn()`  [INFERRED]
  web/src/components/ui/menubar.jsx → web/src/lib/utils.js
- `CommandShortcut()` --calls--> `cn()`  [INFERRED]
  web/src/components/ui/command.jsx → web/src/lib/utils.js
- `BreadcrumbSeparator()` --calls--> `cn()`  [INFERRED]
  web/src/components/ui/breadcrumb.jsx → web/src/lib/utils.js

## Communities (97 total, 23 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.0
Nodes (671): abs, Addr, AllHookFunc, and, AndOrExp, ApiError, App, AppleClientSecretCreate (+663 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (20): __dirname, __filename, COMPONENT_BLACKLIST, __dirname, extractCodeBlocks(), __filename, findJSXElementAtPosition(), generateCode() (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (25): App, AutodateField, BaseField, BoolField, Collection, Database, DateField, DateTime (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (21): ALLOWED_PARENT_ORIGINS, createOverlay(), createSelectedOverlay(), disableSelectionMode(), enableSelectionMode(), extractDOMContext(), getComputedStyles(), getFilePathFromNode() (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (17): cn(), Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader() (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (17): ALLOWED_PARENT_ORIGINS, createDisabledTooltip(), disableEditMode(), enableEditMode(), findDisabledElementAtPoint(), findEditableElementAtPoint(), getParentOrigin(), handleDisabledElementHover() (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (16): allowedFlags, appliedMigrations, cmdArgs, content, files, flags, fn, horizonsCmd (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (11): Button, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.27
Nodes (12): CLEAN_CONTENT_REGEX, cleanContent(), cleanText(), ensureDirectoryExists(), extractHelmetData(), EXTRACTION_REGEX, extractRoutes(), findReactFiles() (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.21
Nodes (11): actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState, reducer(), toast() (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (11): BANDS, BENCHMARKS, calcBurnMultipleScore(), calcCacLtvScore(), calcChurnScore(), calcRevenueMomentumScore(), calcRunwayScore(), calculateFSI() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.31
Nodes (8): APP_DIR, COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP, FILES_UPDATED_BY_SHADCN_INIT, findImportedComponentNames(), pathExists(), run(), runCommand(), scanDirectoryForUiImports()

### Community 15 - "Community 15"
Cohesion: 0.2
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 16 - "Community 16"
Cohesion: 0.2
Nodes (7): FormControl, FormDescription, FormFieldContext, FormItem, FormItemContext, FormLabel, FormMessage

### Community 17 - "Community 17"
Cohesion: 0.2
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 21 - "Community 21"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (5): ChartContainer, ChartContext, ChartLegendContent, ChartTooltipContent, THEMES

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (6): Carousel, CarouselContent, CarouselContext, CarouselItem, CarouselNext, CarouselPrevious

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (7): Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (6): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (3): ProtectedRoute(), AuthContext, useAuth()

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (4): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 38 - "Community 38"
Cohesion: 0.5
Nodes (3): ToggleGroup, ToggleGroupContext, ToggleGroupItem

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 40 - "Community 40"
Cohesion: 0.5
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 41 - "Community 41"
Cohesion: 0.5
Nodes (3): PanelGroupDirectionContext, ResizableHandle(), ResizablePanelGroup()

### Community 42 - "Community 42"
Cohesion: 0.5
Nodes (3): payload, response, senderAddress

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (3): externalUrl, fileContent, response

## Knowledge Gaps
- **932 isolated node(s):** `pkg`, `allDeps`, `addTransformIndexHtml`, `logger`, `APP_DIR` (+927 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 5` to `Community 32`, `Community 36`, `Community 8`, `Community 9`, `Community 41`, `Community 12`, `Community 15`, `Community 17`, `Community 18`, `Community 49`, `Community 20`, `Community 21`, `Community 27`, `Community 28`, `Community 29`, `Community 30`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `MenubarShortcut()` connect `Community 8` to `Community 5`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `CommandShortcut()` connect `Community 15` to `Community 5`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 63 inferred relationships involving `cn()` (e.g. with `DialogHeader()` and `DialogFooter()`) actually correct?**
  _`cn()` has 63 INFERRED edges - model-reasoned connections that need verification._
- **What connects `pkg`, `allDeps`, `addTransformIndexHtml` to the rest of the system?**
  _932 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
## Update: FoundersROI Phase 1 Completion Context

PROJECT: FoundersROI.com — AI Startup Truth Engine
STATUS: Phase 1 PWA complete (Jules QA done)
TECH STACK: Vite + React + Tailwind + PocketBase + PWA
DEPLOYMENT: Vercel (foundersroi-roan.vercel.app live)
BLOCKERS: Custom domain DNS propagation (Hostinger → Vercel)
EMAIL: Brevo outbound working, inbox pending
LEADS: Apollo.io 25 founders → Brevo campaign launched
NEXT: Phase 2 OpenClaw + DeepSeek API + Make.com pipeline
ARCHITECTURE: FoundersROI_Final_Architecture_v2.md (complete spec)
FSI ENGINE: fsiEngine.js (5 weighted metrics, offline-capable)
PRICING: $49/$297/$997/$2,497 (Stripe placeholders ready)
