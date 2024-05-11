<script lang="ts">
  import CartItem from '$lib/components/CartItem.svelte';
  import { addSpaceInString } from '$lib/utils/helpers';
  import type { PageData } from '../$types';
  import { session } from '$lib/session';
  import { onMount } from 'svelte';
  import {
    totalProductCountStore,
    totalProductPriceStore,
  } from '$lib/utils/store';
  export let data: PageData;

  let isLoggedIn: boolean;
  let numberInputs: HTMLInputElement[];
  let sum = 0;

  $: {
    isLoggedIn = $session.isLoggedIn;
  }

  onMount(() => {
    numberInputs = [...document.getElementsByTagName('input')].filter(
      (el) => el.type === 'number'
    );
    totalProductCountStore.set(data.products.length);
  });
  $: {
    if ($totalProductPriceStore.size > 0) {
      sum = [...$totalProductPriceStore.values()].reduce(
        (acc, cur) => acc + cur
      );
    }
  }
</script>

<svelte:head>
  <title>Корзина</title>
</svelte:head>
<h1 class=" w-full pt-6 font-bold text-3xl flex justify-center">Корзина</h1>
<section class="flex justify-evenly gap-x-4 p-4">
  {#if !isLoggedIn}
    <p>Войдите в учетную запись чтобы иметь доступ к корзине</p>
  {:else if data.products.length === 0}
    <p>В вашей корзине пока что пусто.</p>
  {:else}
    <section class="flex flex-col gap-4 mt-6 mb-4">
      {#each data.products as product, index (product.productid)}
        <CartItem
          product={product.products}
          userid={data.userid}
          number={index + 1}
        />
      {/each}
    </section>
    <section
      class="absolute bg-white left-3/4 top-56 rounded-lg border border-gray-300"
    >
      <section class="sticky flex flex-col gap-y-4 w-96 p-4">
        <span class="text-sm text-gray-400">Итого</span>
        <section class="flex w-full gap-x-4 font-bold text-lg">
          <span>Количество товаров:</span>
          <span>{$totalProductCountStore}</span>
        </section>
        <section class="flex w-full gap-x-4 font-bold text-lg">
          <span>Сумма:</span>
          <span>{addSpaceInString(sum.toString())}&#8381;</span>
        </section>
        <button
          class="w-full py-5 text-white bg-blue-600 rounded-lg text-sm font-bold hover:opacity-90"
        >
          Оформить
        </button>
      </section>
    </section>
  {/if}
</section>
