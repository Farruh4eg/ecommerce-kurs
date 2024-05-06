<script lang="ts">
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import SearchResult from '$lib/components/SearchResult.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  export let data: any;

  let products: any = writable([]);
  let page = writable(1);
  const fetchProductData = async () => {
    const response = await fetch(
      `/v1/products?name=${data.searchQuery}&page=${$page}`
    );
    const res = await response.json();
    await products.set(res);
    products = products;
  };

  onMount(async () => {
    fetchProductData();
  });

  $: {
    fetchProductData();
  }
</script>

<svelte:head>
  <title>Результаты поиска</title>
</svelte:head>
<section class="flex justify-evenly gap-x-4 p-4">
  <SearchFilters />
  <section class="flex flex-col gap-4 mt-6 mb-4">
    {#each $products as product (product.productid)}
      <SearchResult {product} userid={data.userid} />
    {/each}
  </section>
  <button
    disabled={$page === 1}
    on:click={() => {
      $page--;
      fetchProductData();
    }}>Назад</button
  >
  <button
    on:click={() => {
      $page++;
      fetchProductData();
    }}>Вперед</button
  >
</section>
