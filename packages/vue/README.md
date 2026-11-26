# kubai-icons-vue

[Kubai Icons](https://icons.kubai.design/) for Vue 3: one tree-shakable component per icon, SSR-friendly and animated on hover.

```bash
npm i kubai-icons-vue
```

```vue
<script setup>
import { Folder, BellOff } from 'kubai-icons-vue';
</script>

<template>
  <Folder :size="28" color="#6366F1" />
  <BellOff variant="soft" title="Muted" />
</template>
```

Props: `size`, `color`, `variant`, `badgeColor`, `trigger`, `hover`, `active` (`v-model:active`), `defaultActive`, `title`. `DynamicIcon` from `kubai-icons-vue/dynamic` loads an icon by name.

## Styles

Three styles share the same names where an icon exists in more than one:

| Style | Import from |
| --- | --- |
| Layered (default) | `kubai-icons-vue` |
| Two-tone | `kubai-icons-vue/duotone` |
| Line | `kubai-icons-vue/line` |

Line icons also take `stroke-width` (any width above 0, default 2) and `variant` (`outline`, `line-duo`, `fill` or `solid-tint`).

[Documentation](https://icons.kubai.design/docs/vue/) · MIT License
