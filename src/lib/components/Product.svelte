<script lang="ts">
  import type { PageData } from "../../../.svelte-kit/types/src/routes/$types.d.ts";
  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    frequencyEnumValueToString,
    addSpaceInString,
  } from "$lib/utils/helpers";

  import ImageContainer from "./ImageContainer.svelte";
  import RatingReadOnly from "./RatingReadOnly.svelte";

  export let product: PageData;

  let productRatingsArray: number[] = [];
  let sum: number;
  let count: number;
  let avg: number;

  $: isHearted = false;
  const fillHeart = () => (isHearted = !isHearted);

  product.ratings.forEach((element) => {
    productRatingsArray.push(element.rating);
  });

  sum = productRatingsArray.reduce((a, b) => a + b, 0);
  count = productRatingsArray.length;
  avg = sum / count || 0;

  $: supplierLogo = product.suppliers.logo;
  $: productId = product.productid;
  $: productThumb = product.photo[0];
  $: productName = product.name;
  $: productColor = product.color;
  $: productInStock = product.instock;
  $: productDiscountAvailable = true;
  $: productDiscountAmount = product.discount || 8;

  $: productType = deviceEnumValueToString(product.producttype);
  $: productDisplaySize = product.displaysize || "";
  $: productPrice = product.price;
  $: productPriceString = addSpaceInString(product.price.toString());

  $: productMemory = product.memoryamount
    ? `${product.memoryamount} ${memoryEnumValueToString(product.memoryunit)}`
    : "";

  $: productCpu = product.cpucores
    ? `ядер - ${product.cpucores}x(${
        product.cpufrequency
      } ${frequencyEnumValueToString(product.cpufrequencyunit)})`
    : "";

  $: productRam = product.ramamount
    ? `${product.ramamount} ${memoryEnumValueToString(product.ramunit)}`
    : "";

  $: productSim = product.simcount ? `${product.simcount} SIM` : "";

  $: productDisplayResolution = product.displayheight
    ? product.displaywidth > product.displayheight
      ? `${product.displaywidth}x${product.displayheight}`
      : `${product.displayheight}x${product.displaywidth}`
    : "";

  $: productDisplayRefresh = product.refreshrate
    ? `${product.refreshrate} Гц`
    : "";

  $: productCamera = product.cameraresolution
    ? `камера ${product.cameraresolution} Мп`
    : "";

  $: productBattery = product.batterycapacity
    ? `${product.batterycapacity} мА*ч`
    : "";
</script>

<svelte:head>
  <title
    >{productDisplaySize}" {productType}
    {productName}
    {productMemory}
    {productColor}</title
  >
</svelte:head>

<section class="flex flex-col w-8/12 my-0 mx-auto box-border p-8 text-gray-700">
  <h1 class=" w-full pb-4 font-bold text-3xl">
    {productDisplaySize}" {productType}
    {productName}
    {productMemory}
    {productColor}
  </h1>
  <section class="w-full bg-white p-8 text-gray-700">
    <section class="flex">
      <ImageContainer productPhotos={product.photo} />
      <section class="flex flex-col w-full px-6">
        <section class="flex w-full h-12 items-start justify-around">
          <section class="w-4/5">
            <span
              >{productCpu}, {productRam}, {productSim}, {productDisplayResolution},
              {productDisplayRefresh}, {productCamera}, {productBattery}</span
            >
            <a href="#specs" class="no-underline text-blue-600">подробнее</a>
          </section>
          <section class="w-1/5 flex justify-end mx-1">
            <img src={supplierLogo} alt="supplier-logo" class="h-full" />
          </section>
        </section>
        <section class="flex w-full py-2">
          <RatingReadOnly rating={avg} ratingCount={count} height={5} />
        </section>
        <section class="mt-4 w-full rounded-lg p-3 shadow-md">
          <section class="flex items-end gap-x-1">
            <span class="font-semibold text-2xl text-blue-600"
              >{productPriceString} &#8381;</span
            >
            {#if productDiscountAvailable}
              <span class="text-sm text-gray-600 line-through"
                >{addSpaceInString(
                  parseInt(
                    productPrice + (productPrice / 100) * productDiscountAmount
                  ).toString()
                )}</span
              >
            {/if}
          </section>
        </section>
      </section>
    </section>
  </section>
</section>

<style>
</style>
