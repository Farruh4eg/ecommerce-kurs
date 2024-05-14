<script lang="ts">
  import Product from '$lib/components/Product.svelte';
  import type { PageData } from './$types';
  export let data: any;
</script>

<Product
  product={data.product}
  userid={data.userid}
  rating={data.rating}
  isRated={data.isRated}
/>
