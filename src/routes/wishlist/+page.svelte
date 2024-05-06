<script lang="ts">
  import SearchResult from '$lib/components/SearchResult.svelte';
  import type { PageData } from '../$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Избранное</title>
</svelte:head>
<section class="flex justify-evenly gap-x-4 p-4">
  {#if data.products.length === 0}
    <p>Ваш список избранных пуст</p>
  {:else}
    <section class="flex flex-col gap-4 mt-6 mb-4">
      {#each data.products as product (product.productid)}
        <SearchResult product={product.products} userid={data.userid} />
      {/each}
    </section>
  {/if}
</section>
