<script lang="ts">
  import Product from '$lib/components/Product.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  console.log(data.product);
</script>

<slot>
  <div>
    <main>
      <Product product={data.product} />
    </main>
  </div>
</slot>
