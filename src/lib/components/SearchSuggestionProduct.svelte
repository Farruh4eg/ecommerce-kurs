<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';
  import { addSpaceInString } from '$lib/utils/helpers.js';
  import type { Rating } from '$lib/utils/interfaces.js';

  export let product: PageData;

  let sum: number;
  let count: number;
  let avg: number;
  let productId: string;
  let productThumb: string;
  let productName: string;
  let productPrice: string;
  let productRatingsArray: number[] = [];

  if (Array.isArray(product)) {
    productPrice = addSpaceInString(
      parseInt(
        (
          product[0].price -
          (product[0].price * product[0].discount) / 100
        ).toString()
      ).toString()
    );
    productId = product[0].productid;
    if (Array.isArray(product[0].photo)) {
      productThumb = product[0].photo[0];
    } else {
      productThumb = product[0].photo[0];
    }
    productName = product[0].name;
    product[0].ratings.forEach((element: Rating) => {
      productRatingsArray.push(element.rating);
    });
  } else {
    productPrice = addSpaceInString(
      parseInt(
        (product.price - (product.price / 100) * product.discount).toString()
      ).toString()
    );
    productId = product.productid;
    productThumb = product.photo;
    productName = product.name;
    product.ratings.forEach((element: Rating) => {
      productRatingsArray.push(element.rating);
    });
  }
  if (Array.isArray(productThumb)) {
    productThumb = productThumb[0];
  }

  sum = productRatingsArray.reduce((a, b) => a + b, 0);
  count = productRatingsArray.length;
  avg = sum / count || 0;

  const handleProductChange = () => {
    window.location.href = `/products/${productId}`;
  };
</script>

<section class="w-full flex gap-2">
  <div class="relative h-16 flex justify-center w-32">
    <img
      src="/products/{productThumb}"
      alt="thumb-{productName}"
      class="h-full"
    />
  </div>
  <section class="flex flex-col justify-start w-full gap-2">
    <a
      on:click={handleProductChange}
      class="hover:text-blue-600 w-full h-max hover:cursor-pointer"
    >
      {productName}
    </a>
    <span class="font-semibold text-blue-600">{productPrice} &#8381;</span>
  </section>
</section>
