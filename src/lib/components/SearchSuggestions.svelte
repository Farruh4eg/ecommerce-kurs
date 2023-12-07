<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';
  import SearchSuggestionProduct from './SearchSuggestionProduct.svelte';

  export let data: PageData;
  export let width: number;

  onMount(async () => {
    console.log(width);
  });
</script>

<section class="h-12 bg-gray-500 w-[{width}px]">
  {#each data.products as product (product.productid)}
    <SearchSuggestionProduct {product} {width} />
  {/each}
  <h1>Test</h1>
</section>
