<script lang="ts">
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import SearchResult from '$lib/components/SearchResult.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { page } from '$app/stores';

  export let data: any;

  let products: any = writable([]);

  let url = $page.url.searchParams;
  let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
  let instock = url.get('inStock') === 'true' ? 'true' : 'all';
  let rating = url.get('rating') === 'good' ? 'good' : 'all';
  const suppliers = url.get('brand') || '';
  const price = url.get('price') || '0-500000';
  const producttype = url.get('type') || '';

  let totalPages = writable(1);

  const fetchProductData = async () => {
    const response = await fetch(
      `/v1/products?q=${data.searchQuery}&page=${$pageN}&inStock=${instock}&rating=${rating}&brand=${suppliers}&price=${price}&type=${producttype}`
    );
    const { products: resProducts, totalPages: resTotalPages } =
      await response.json();
    await products.set(resProducts);
    totalPages.set(resTotalPages);
  };

  onMount(async () => {
    await fetchProductData();
  });
</script>

<svelte:head>
  <title>Результаты поиска</title>
</svelte:head>
<section class="flex justify-evenly gap-x-4 p-4 w-[1280px] mx-auto">
  {#if $products?.length > 0}
    <SearchFilters data={$products} query={data.searchQuery} />
  {/if}
  <section
    class="flex flex-col gap-4 mt-6 mb-4 min-w-[40%]"
    id="search-results-container"
  >
    {#if $products?.length > 0}
      {#each $products as product (product.productid)}
        <SearchResult {product} userid={data.userid} />
      {/each}
      <section class="flex gap-x-20 h-max justify-center mt-16">
        <button
          class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
          disabled={$pageN === 1}
          on:click={() => {
            $pageN--;
            document
              .getElementById('search-results-container')
              ?.scrollIntoView({
                behavior: 'smooth',
              });
            fetchProductData();
          }}>Назад</button
        >
        <button
          class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
          disabled={$pageN === $totalPages}
          on:click={() => {
            $pageN++;
            document
              .getElementById('search-results-container')
              ?.scrollIntoView({
                behavior: 'smooth',
              });
            fetchProductData();
          }}>Вперед</button
        >
      </section>
    {:else}
      <p>По вашему запросу ничего не найдено</p>
    {/if}
  </section>
</section>
