<script lang="ts">
  import SearchResult from '$lib/components/SearchResult.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<slot>
  <section class="flex flex-col gap-4 mt-6 mb-4">
    {#each data.products as product (product.productid)}
      <SearchResult {product} rating={product.productid} />
    {/each}
  </section>
</slot>
