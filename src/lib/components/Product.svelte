<script lang="ts">
  import type { PageData } from '../../../.svelte-kit/types/src/routes/$types.d.ts';
  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    frequencyEnumValueToString,
    addSpaceInString,
  } from '$lib/utils/helpers';
  import ImageContainer from './ImageContainer.svelte';

  export let product: PageData;

  let supplierLogo = product.suppliers.logo;
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

<svelte:head>
  <title
    >{productDisplaySize}" {productType}
    {productName}
    {productMemory}
    {productColor}</title
  >
</svelte:head>

<section
  class="flex flex-col w-11/12 my-0 mx-auto box-border p-8 text-gray-700"
>
  <h1 class=" w-full pb-4 font-bold text-3xl">
    {productDisplaySize}" {productType}
    {productName}
    {productMemory}
    {productColor}
  </h1>
  <section class="w-full bg-white p-8 text-gray-700">
    <section class="flex">
      <ImageContainer productPhotos={product.photo} />
      <section class="flex flex-col">
        <section class="flex w-full h-10 items-start">
          <section class="w-4/5">
            <span
              >{productCpu}, {productRam}, {productSim}, {productDisplayResolution},
              {productDisplayRefresh}, {productCamera}, {productBattery}</span
            >
            <a href="#specs" class="no-underline text-blue-600">подробнее</a>
          </section>
          <section class="max-h-6 w-1/5 flex justify-end mx-1">
            <img src={supplierLogo} alt="supplier-logo" class="h-full" />
          </section>
        </section>
      </section>
    </section>
  </section>
</section>

<style>
</style>
