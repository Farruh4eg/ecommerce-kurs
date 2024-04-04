<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>...</title>
</svelte:head>

<slot>
  <div class="flex flex-col">
    {#each data.products as product (product.productid)}
      <a href="products/{product.productid}" class="text-red-500"
        >{product.name}</a
      >
    {/each}
  </div>
</slot>
