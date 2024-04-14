<script lang="ts">
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import SearchResult from '$lib/components/SearchResult.svelte';
  export let data: any;
</script>

<svelte:head>
  <title>Результаты поиска</title>
</svelte:head>
<section class="flex justify-evenly gap-x-4 p-4">
  <SearchFilters />
  <section class="flex flex-col gap-4 mt-6 mb-4">
    {#each data.products as product (product.productid)}
      <SearchResult {product} userid={data.userid} />
    {/each}
  </section>
</section>
