<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';
  import type { Rating } from '$lib/utils/interfaces.js';

  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    frequencyEnumValueToString,
    addSpaceInString,
  } from '$lib/utils/helpers';

  import RatingReadOnly from './RatingReadOnly.svelte';
  import ButtonLike from './ButtonLike.svelte';
  import ButtonBuy from './ButtonBuy.svelte';

  export let product;
  export let userid: string;

  let productid = product.productid;
  let productThumb = product.photo[0];
  let productName = product.name;
  let productColor = product.color;
  let productInStock: boolean = product.instock;
  let productDiscountAvailable: boolean = true;
  let productDiscountAmount = product.discount || 8;
  let productRatingsArray: number[] = [];

  product.ratings.forEach((element: Rating) => {
    productRatingsArray.push(element.rating);
  });
  const sum = productRatingsArray.reduce((a, b) => a + b, 0);
  const count = productRatingsArray.length;
  const avg = sum / count || 0;
  let productType = deviceEnumValueToString(product.producttype);
  let productDisplaySize = product.displaysize || '';
  let productPrice = product.price;
  let productPriceString = addSpaceInString(product.price.toString());

  let productMemory = product.memoryamount
    ? `${product.memoryamount} ${memoryEnumValueToString(product.memoryunit)}`
    : '';

  let productCpu = product.cpucores
    ? `ядер - ${product.cpucores}x(${
        product.cpufrequency
      } ${frequencyEnumValueToString(product.cpufrequencyunit)})`
    : '';

  let productRam = product.ramamount
    ? `${product.ramamount} ${memoryEnumValueToString(product.ramunit)}`
    : '';

  let productSim = product.simcount ? `${product.simcount} SIM` : '';

  let productDisplayResolution = product.displayheight
    ? product.displaywidth > product.displayheight
      ? `${product.displaywidth}x${product.displayheight}`
      : `${product.displayheight}x${product.displaywidth}`
    : '';

  let productDisplayRefresh = product.refreshrate
    ? `${product.refreshrate} Гц`
    : '';

  let productCamera = product.cameraresolution
    ? `камера ${product.cameraresolution} Мп`
    : '';

  let productBattery = product.batterycapacity
    ? `${product.batterycapacity} мА*ч`
    : '';
</script>

<section class="w-full flex bg-white p-5 rounded-lg">
  <div class="relative h-52 flex justify-center w-64">
    <img src={productThumb} alt="thumb-{productName}" />
    {#if productDiscountAvailable}
      <span
        class="absolute rounded-3xl bg-blue-500 text-gray-50 p-2 text-xs right-36 top-40"
        >-{productDiscountAmount}%</span
      >
    {/if}
  </div>

  <section class="flex justify-between w-full p-1 flex-col rounded-xl">
    <a
      href="/products/{productid}"
      class="hover:text-blue-600 w-full h-max pb-12"
      >{productDisplaySize}" {productType}
      {productName}
      {productMemory}
      {productColor} [{productCpu}, {productRam}, {productSim}, {productDisplayResolution},
      {productDisplayRefresh}, {productCamera}, {productBattery}]</a
    >
    <section class="flex flex-col justify-between p-1 items-end">
      <section class="flex gap-x-4 justify-between w-full">
        <section class="flex flex-col w-full">
          {#if productDiscountAvailable}
            <span class="text-sm text-gray-600 line-through"
              >{addSpaceInString(productPriceString)}
              <p></p></span
            >
          {/if}
          <span class="font-semibold text-2xl text-blue-600"
            >{addSpaceInString(
              parseInt(
                (
                  productPrice -
                  (productPrice / 100) * productDiscountAmount
                ).toString()
              ).toString()
            )} &#8381;</span
          >
          <section
            class="w-full flex justify-between pr-8 text-md text-gray-600 items-end"
          >
            <span
              >В наличии:
              {#if productInStock}
                <span class=" text-green-600">да</span>
              {:else}
                <span class="text-red-600">нет</span>
              {/if}
            </span>
            <RatingReadOnly
              rating={parseFloat(avg.toFixed(1))}
              ratingCount={count}
              height={5}
            />
          </section>
        </section>
        <section class="flex gap-x-4 items-end">
          <ButtonLike {userid} {productid} />
          <ButtonBuy {userid} {productid} />
        </section>
      </section>
    </section>
  </section>
</section>
