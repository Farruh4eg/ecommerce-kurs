<script lang="ts">
  import type { Rating } from '$lib/utils/interfaces.js';
  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    addSpaceInString,
    handleSubmit,
  } from '$lib/utils/helpers';
  import RatingReadOnly from './RatingReadOnly.svelte';
  import ButtonLike from './ButtonLike.svelte';
  import ButtonDelete from './ButtonDelete.svelte';
  import {
    totalProductPriceStore,
    totalProductCountStore,
  } from '../utils/store';

  export let product;
  export let userid: string;
  export let productCount: number = 1;
  export let number;

  let dialog: HTMLDialogElement;

  $: {
    if (productCount === 0) {
      productCount = 1;
      dialog.showModal();
    } else if (productCount < 1) productCount = 1;
    else if (productCount > 129) productCount = 129;
  }

  let validateCount: (el: any) => void;

  $: validateCount = (el) => {
    if (productCount === 0) {
      productCount = 1;
      dialog.showModal();
    } else if (
      parseInt(el.target.value) < 1 ||
      isNaN(parseInt(el.target.value))
    ) {
      productCount = 1;
    } else if (parseInt(el.target.value) > 129) {
      productCount = 129;
    }
  };

  let productid = product.productid;
  let productThumb = product.photo[0];
  let productName = product.name;
  let productColor = product.color;
  let productInStock: boolean = product.instock;
  let productDiscountAvailable: boolean = product.discountAvailable;
  let productDiscountAmount = product.discount;
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
  let productPriceWithDiscount = addSpaceInString(
    parseInt(
      (productPrice - (productPrice / 100) * productDiscountAmount).toString()
    ).toString()
  );

  $: totalProductPrice =
    parseInt(productPriceWithDiscount.split(' ').join('')) * productCount;

  let productMemory = product.memoryamount
    ? `${product.memoryamount} ${memoryEnumValueToString(product.memoryunit)}`
    : '';

  const deleteItem = async () => {
    await handleSubmit(
      '/v1/cart',
      'DELETE',
      {
        userid,
        productid,
      },
      {
        'Content-Type': 'applicaton/json',
      }
    );
    window.location.href = '/cart';
  };

  $: {
    totalProductPriceStore.update((map: any) => {
      map[productid] = totalProductPrice;
      return map;
    });

    totalProductCountStore.update((map: any) => {
      map[productid] = productCount;
      return map;
    });
  }
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
      {productColor}</a
    >
    <section class="border border-gray-300 flex rounded-lg w-max">
      <button
        on:click={() => {
          productCount--;
        }}
        class="px-4 hover:bg-gray-200 rounded-md text-xl flex justify-center items-center content-center text-center w-max"
        >&#8212;</button
      >
      <input
        type="number"
        name="product-count"
        id="product-count"
        bind:value={productCount}
        step="1"
        min="0"
        max="129"
        class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12 p-1 text-center"
        on:focusout={validateCount}
      />
      <button
        on:click={() => {
          productCount++;
        }}
        class="px-4 hover:bg-gray-200 rounded-md text-2xl flex justify-center items-center content-center text-center w-max"
        >+</button
      >
    </section>
    <section class="flex flex-col justify-between p-1 items-end">
      <section class=" flex rounded-lg w-max font-bold">
        <span>{addSpaceInString(totalProductPrice.toString())}&#8381;</span>
      </section>
      <section class="flex gap-x-4 justify-between w-full">
        <section class="flex flex-col w-full">
          {#if productDiscountAvailable}
            <span class="text-sm text-gray-600 line-through"
              >{productPriceString}
              <p></p></span
            >
          {/if}
          <span class="font-semibold text-2xl text-blue-600"
            >{productPriceWithDiscount} &#8381;</span
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
          <ButtonDelete {userid} {productid} />
        </section>
      </section>
    </section>
  </section>
</section>

<dialog bind:this={dialog} class="w-1/5 rounded-lg">
  <section class="w-full h-48 p-10 flex flex-col justify-between">
    <p>Вы уверены что хотите удалить товар с вашей корзины?</p>
    <section class="flex w-full justify-end gap-x-12">
      <button
        on:click={() => {
          productCount = 1;
          dialog.close();
        }}
        class="py-2 px-8 border border-gray-300 hover:bg-blue-500 hover:text-white rounded-md"
        autofocus
      >
        Нет
      </button>
      <button
        on:click={() => {
          deleteItem();
          dialog.close();
        }}
        class="py-2 px-8 border border-gray-300 bg-red-600 text-white rounded-md"
        >Да</button
      >
    </section>
  </section>
</dialog>
