<script lang="ts">
  import {
    deviceEnumValueToString,
    addSpaceInString,
  } from '$lib/utils/helpers';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>...</title>
</svelte:head>

<section
  class="w-[1280px] mx-auto bg-white m-4 rounded-lg flex flex-col gap-y-24 p-4"
>
  <section class="flex flex-col gap-y-8">
    <section class="flex gap-x-4 w-full justify-around">
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=SMARTPHONE"
          data-sveltekit-reload
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Смартфоны<img
            src="/misc/smartphone.jpg"
            class="h-36"
            alt="smartphone"
          /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=TABLET"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Планшеты<img src="/misc/tablet.jpg" class="h-36" alt="tablet" /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=CELLPHONE"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Сотовые телефоны<img
            src="/misc/cellphone.jpg"
            class="h-36"
            alt="cellphone"
          /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=CABLE"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Кабели<img src="/misc/cable.jpg" class="h-36" alt="cable" /></a
        >
      </section>
    </section>
    <section class="flex gap-x-4 w-full justify-around">
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=PLAYER"
          data-sveltekit-reload
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Плееры<img src="/misc/player.webp" class="h-36" alt="player" /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=WATCH"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Часы<img src="/misc/watch.jpg" class="h-36" alt="watch" /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=CHARGER"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Зарядные устройства<img
            src="/misc/charger.jpg"
            class="h-36"
            alt="charger"
          /></a
        >
      </section>
      <section
        class="flex flex-col h-full border w-1/4 border-gray-300 p-2 rounded-lg"
      >
        <a
          href="/search/products?q=&inStock=all&rating=all&price=50-500000&brand=&type=HEADPHONE"
          class="flex flex-col gap-y-2 items-center font-bold text-lg w-full"
          >Наушники<img
            src="/misc/headphone.webp"
            class="h-36"
            alt="headphone"
          /></a
        >
      </section>
    </section>
  </section>
  <section
    class="flex gap-x-8 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
  >
    {#if data}
      {#each data.suppliers as supplier}
        <a
          class="flex p-2 rounded-xl h-16 border border-gray-200 shadow-md"
          href="http://localhost:5173/search/products?q=&inStock=all&rating=all&price=50-500000&brand={supplier.companyname}&type="
          ><img
            src="/suppliers/{supplier.logo}"
            alt="{supplier.companyname}-logo"
          /></a
        >
      {/each}
    {/if}
  </section>
  <section class="flex gap-x-4 w-full flex-col gap-y-4">
    <h1 class="text-2xl font-bold">Последние товары</h1>
    {#if data}
      <section class="flex w-full gap-4 justify-start">
        {#each data.products as product}
          <section
            class="flex flex-col gap-y-2 w-[24%] p-2 border border-gray-200 shadow-md rounded-lg"
          >
            <section>
              <a
                href="/products/{product.productid}"
                class="flex flex-col gap-y-2 h-max items-center py-4"
              >
                <img
                  src="/products/{product.photo[0]}"
                  class="w-max h-48"
                  alt="{product.name}-thumb"
                />
                {deviceEnumValueToString(product.producttype)}
                {product.name}
                {product.color}
              </a>
            </section>
            <section
              class="flex items-end gap-x-1 py-2 pr-8 pl-2 justify-start w-max"
            >
              <span class=" text-blue-600 text-xl font-bold"
                >{addSpaceInString(product.discountedprice.toString())} &#8381;</span
              >
              <span class="text-sm line-through"
                >{addSpaceInString(product.price.toString())}&#8381;</span
              >
            </section>
          </section>
        {/each}
      </section>
    {/if}
  </section>
</section>
