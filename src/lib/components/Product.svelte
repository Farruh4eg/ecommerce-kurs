<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';
  export let product: PageData;
</script>

<h1>{product.name}</h1>
<h1>{product.releaseyear}</h1>
<h1>{product.color}</h1>

<style>
</style>
