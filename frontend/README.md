# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

-   [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

# ✨ Estilo de codificación

## 1. Orden en los ficheros

Siempre primero en los ficheros VUE, irá:

`<template lang="pug">`

seguido de:

`<script setup lang="ts">`

**Está estrictamente prohibido subircódigo a la rama master con el estilo dentro del fichero '.vue.'**

## 2. Declaración de props

Siempre usando la macro `defineProps` y para tipar los tipos complejos con `PropType`.
Si no voy a usar las props dentro del script, no hce falta asignarlo a una variable.

```
const props = defineProps({
    disc: { type: String, required: true },
    includeAll: { type: Boolean, default: true },
    modelValue: { type: String },
    list: { type: Array as PropType<OutEventData[]> }
});
```

## 3. Declaración de emits

Usando la macro `defineEmits`, y tipando los parámetros que se envían en el evento.

```
const emit = defineEmits<{
    (event: 'update:modelValue', value: string | null): void;
    (event: 'change', value: OutEventData | null): void;
}>();
```

## 4. Tipado de Ref

Vamos a usar la opción del tipo paramétrico en lugar del `as`.<br>
Ejemplo:
`const value = ref<string | null>(null);`<br>
Cuando nos valga la inferencia de tipos por defecto obviaremos el parámetro a la prop.
