<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';

  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    frequencyEnumValueToString,
    addSpaceInString,
  } from '$lib/utils/helpers';

  import RatingReadOnly from './RatingReadOnly.svelte';

  $: isHearted = false;

  const fillHeart = () => (isHearted = !isHearted);

  export let product: PageData;

  let productId = product.productid;
  let productThumb = product.photo[0];
  let productName = product.name;
  let productColor = product.color;
  let productInStock: boolean = product.instock;
  let productDiscountAvailable: boolean = true;
  let productDiscountAmount = product.discount || 8;
  let productRatingsArray = [];
  product.ratings.forEach((element) => {
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
  <div class="relative h-52 flex justify-end w-64">
    <img src={productThumb} alt="thumb-{productName}" />
    {#if productDiscountAvailable}
      <span
        class="absolute rounded-3xl bg-blue-500 text-gray-50 p-2 text-xs font-bold"
        >-{productDiscountAmount}%</span
      >
    {/if}
  </div>
  <section class="flex justify-between w-full p-1 flex-col">
    <a
      href="/products/{productId}"
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
              >{addSpaceInString(
                parseInt(
                  productPrice + (productPrice / 100) * productDiscountAmount
                ).toString()
              )}</span
            >
          {/if}
          <span class="font-semibold text-2xl text-blue-600"
            >{productPriceString} &#8381;</span
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
            <RatingReadOnly rating={avg.toFixed(1)} ratingCount={count} />
          </section>
        </section>
        <section class="flex gap-x-4 items-end">
          <button
            on:click={fillHeart}
            class="p-4 border-2 border-solid border-gray-200 w-16 h-16 rounded-xl hover:bg-gray-50 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="gray"
              fill={isHearted ? 'blue' : 'none'}
              class="h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <button
            class="p-4 border-2 border-solid border-gray-200 w-32 rounded-xl hover:bg-blue-600 hover:text-white"
            >Купить</button
          >
        </section>
      </section>
    </section>
  </section>
</section>
