<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';

  export let product: PageData;
  export let width: number;

  let productId = product.productid;
  let productThumb = product.photo[0];
  let productName = product.name;
  let productRatingsArray: number[] = [];
  product.ratings.forEach((element) => {
    productRatingsArray.push(element.rating);
  });
  const sum = productRatingsArray.reduce((a, b) => a + b, 0);
  const count = productRatingsArray.length;
  const avg = sum / count || 0;
</script>

<section class={classNames}>
  <img src={productThumb} alt="thumb-{productName}" />
  <a href="products/{productId}" class="hover:text-blue-600 w-full h-max pb-12">
    {productName}
  </a>
</section>
