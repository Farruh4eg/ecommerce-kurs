<script lang="ts">
  import SearchSuggestionProduct from './SearchSuggestionProduct.svelte';

  export let data: any;
</script>

<section
  class="w-96 bg-white absolute p-5 box-border ml-2 rounded-b-xl top-full flex flex-col gap-y-2 content-center items-center max-h-96 overflow-scroll"
>
  {#if data.length == 1}
    <SearchSuggestionProduct product={data} />
  {:else if data.length > 1}
    {#each data as product (product.productid)}
      <SearchSuggestionProduct {product} />
    {/each}
  {/if}
</section>
