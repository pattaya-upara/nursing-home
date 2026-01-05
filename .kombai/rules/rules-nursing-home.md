# Main Layout

## Concepts
- I call UI foundation and build-up in Foundation, Elements, Components, Pages or screens, then Flows
- **Button Regulation**: Buttons inherit base styling automatically. Use semantic signal classes for flow navigation:
  - `.primary`: Main forward flow (Solid blue)
  - `.secondary`: Alternative flow (Lower saturation side color)
  - `.tertiary`: Optional/neutral flow (neutral, cancel, back color)
  - `.brand`: Identity/decoration flow
  - `.icon-start` / `.icon-end`: Semantic padding adjustments for icon placement.
- **HSL Foundation**: Never use HEX. Color system is built on `hsl()`/`hsla()` variables for global control.
- **Surface Foundation**: Body area uses "Cloud Dancer" `hsl(43, 19%, 93%)`. Components/Cards use pure white `hsl(0, 0%, 100%)`.
- the actions, available as buttons in button components, the ones that go forward to the flow will always on the left or the button/command groups. For backward direction, ex. cancel or back button, always on the left of the component.
- sizing and spacing. ALWAYS prefer outer part to control the spacing, the more inner/nested items will be all stretched to the outer component frame. when viewport size changes, the outer part will control the size behaviour.

## Top Bar
- 

## Left Sidebar

## Content Area
- content area works as first-level content navigation. UIs using at this level could either be tubular style table or card style list.
- for card style list, use a 3-column layout. For tubular style table, use a full-width layout.
- when clicked on these items, Sidesheet will be used as second-level content detail.

## Right Sidesheet
- since we are using a very large Sidesheet, Sidesheet will be using a 2 column layout with gray border in the middle as separator guidelines.
- content on the left side, top part always linked the first-level content detail, while bottom part will be the additional information.
- content on the right side will always be a details configuration form. where user can add the configuration specifically about this item.
- for now sidesheet will always using the same layout, but we will have different content on the left and right side.
- Right sidesheet always have a bottom button bars where all the content control actions are placed.

Example:
- Content area shows a list of staffs. When clicked on a staff, Sidesheet will be opened with the staff's details on the left side, and a staff configuration form on the right side.
- Content area shows a list of packages. When clicked on a package, Sidesheet will be opened with the package's details on the left side, and a package configuration form on the right side. which are services that bind with team that need to finish the tasks, and working duration.