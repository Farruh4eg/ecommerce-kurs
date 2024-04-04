<script lang="ts">
  import Product from '$lib/components/Product.svelte';
  import type { PageData } from './$types';
  export let data: any;
</script>

<Product product={data.product} />
