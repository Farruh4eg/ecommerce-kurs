<script lang="ts">
  import CartItem from '$lib/components/CartItem.svelte';
  import { addSpaceInString, handleFetch } from '$lib/utils/helpers';
  import type { PageData } from '../$types';
  import { session } from '$lib/session';
  import { onMount } from 'svelte';
  import {
    totalProductCountStore,
    totalProductPriceStore,
  } from '$lib/utils/store';

  export let data: PageData;

  let dialog: HTMLDialogElement;

  let isLoggedIn: boolean;
  let sum = 0;
  let count = 0;

  $: {
    isLoggedIn = $session.isLoggedIn;
  }

  onMount(() => {
    count = data.products.length;
  });

  $: {
    if (Object.keys($totalProductPriceStore).length > 0) {
      sum = Object.values($totalProductPriceStore).reduce(
        (acc, cur) => acc + cur
      );
    }
    if (Object.keys($totalProductCountStore).length > 0) {
      count = Object.values($totalProductCountStore).reduce(
        (acc, cur) => acc + cur
      );
    }
  }

  const proceedCheckout = async () => {
    if (!data.userDataFilled) return;
    const response = await handleFetch('/v1/orders', 'POST', {
      userid: data.userid,
      bodyProducts: $totalProductCountStore,
    });

    if (response.ok) {
      deleteCart();
      window.location.href = '/orders';
    }
  };

  const deleteCart = async () => {
    await handleFetch(
      '/v1/cart',
      'DELETE',
      {
        userid: data.userid,
      },
      {
        'Content-Type': 'applicaton/json',
      }
    );
    window.location.href = '/cart';
  };
</script>

<svelte:head>
  <title>Корзина</title>
</svelte:head>
<h1 class="w-full pt-6 font-bold text-3xl flex justify-center">Корзина</h1>
<section class="flex gap-x-4 justify-evenly p-4 w-full">
  {#if !isLoggedIn}
    <p>Войдите в учетную запись чтобы иметь доступ к корзине</p>
  {:else if data.products.length === 0}
    <p>В вашей корзине пока что пусто.</p>
  {:else}
    <section class="flex flex-col gap-4 mt-6 mb-4 relative ml-10 min-w-[50%]">
      {#each data.products as product, index (product.productid)}
        <CartItem
          product={product.products}
          userid={data.userid}
          number={index + 1}
        />
      {/each}
    </section>
    <section
      class="relative bg-white rounded-lg border border-gray-300 ml-16 h-80 mt-10"
    >
      <section
        class="sticky flex flex-col gap-y-4 w-96 p-6 justify-between h-full"
      >
        <section class="flex flex-col gap-y-4 w-full">
          <span class="text-sm text-gray-400">Итого</span>
          <section class="flex w-full gap-x-4 font-bold text-lg">
            <span>Количество товаров:</span>
            <span>{count}</span>
          </section>
          <section class="flex w-full gap-x-4 font-bold text-lg">
            <span>Сумма:</span>
            <span>{addSpaceInString(sum.toString())}&#8381;</span>
          </section>
          <span hidden={data.userDataFilled}
            >Для оформления пожалуйста заполните ваши данные в <a
              href="/profile"
              class="text-blue-500">личном кабинете</a
            ></span
          >
        </section>
        <button
          on:click={() => dialog.showModal()}
          class="py-3 px-8 border border-gray-300 font-bold rounded-lg hover:opacity-90 hover:bg-red-600 hover:text-white"
          >Удалить все</button
        >
        <button
          class="w-full py-5 text-white bg-blue-600 rounded-lg text-sm font-bold hover:opacity-90"
          on:click={proceedCheckout}
        >
          Оформить
        </button>
      </section>
    </section>
  {/if}
</section>

<dialog bind:this={dialog} class="w-1/5 rounded-lg">
  <section class="w-full h-48 p-10 flex flex-col justify-between">
    <p>Вы уверены что хотите удалить все товары с вашей корзины?</p>
    <section class="flex w-full justify-end gap-x-12">
      <button
        on:click={() => {
          dialog.close();
        }}
        class="py-2 px-8 border border-gray-300 hover:bg-blue-500 hover:text-white rounded-md"
        autofocus
      >
        Нет
      </button>
      <button
        on:click={() => {
          deleteCart();
          dialog.close();
        }}
        class="py-2 px-8 border border-gray-300 bg-red-600 text-white rounded-md"
        >Да</button
      >
    </section>
  </section>
</dialog>
