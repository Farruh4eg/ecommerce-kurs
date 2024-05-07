<script lang="ts">
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import SearchResult from '$lib/components/SearchResult.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  export let data: any;

  let products: any = writable([]);
  let page = writable(1);
  let totalPages = writable(1);

  const fetchProductData = async () => {
    const response = await fetch(
      `/v1/products?name=${data.searchQuery}&page=${$page}`
    );
    const { products: resProducts, totalPages: resTotalPages } =
      await response.json();
    await products.set(resProducts);
    await totalPages.set(resTotalPages);
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
  <section class="flex flex-col gap-4 mt-6 mb-4" id="search-results-container">
    {#each $products as product (product.productid)}
      <SearchResult {product} userid={data.userid} />
    {/each}
    <section class="flex gap-x-20 h-max justify-center mt-16">
      <button
        class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
        disabled={$page === 1}
        on:click={() => {
          $page--;
          document.getElementById('search-results-container')?.scrollIntoView({
            behavior: 'smooth',
          });
          fetchProductData();
        }}>Назад</button
      >
      <button
        class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
        disabled={$page === $totalPages}
        on:click={() => {
          $page++;
          document.getElementById('search-results-container')?.scrollIntoView({
            behavior: 'smooth',
          });
          fetchProductData();
        }}>Вперед</button
      >
    </section>
  </section>
</section>
