<script lang="ts">
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import SearchResult from '$lib/components/SearchResult.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Результаты поиска</title>
</svelte:head>
<section class="flex justify-around gap-x-4 p-4">
  <SearchFilters />
  <section class="flex flex-col gap-4 mt-6 mb-4">
    {#each data.products as product (product.productid)}
      <SearchResult {product} rating={product.productid} />
    {/each}
  </section>
</section>
