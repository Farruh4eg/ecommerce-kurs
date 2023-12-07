<script lang="ts">
  import SearchResult from '$lib/components/SearchResult.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Результаты поиска</title>
</svelte:head>
<slot>
  <section class="flex flex-col gap-4 mt-6 mb-4">
    {#each data.products as product (product.productid)}
      <SearchResult {product} rating={product.productid} />
    {/each}
  </section>
</slot>
