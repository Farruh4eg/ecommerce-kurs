<script lang="ts">
  import {
    deviceEnumValueToString,
    memoryEnumValueToString,
    frequencyEnumValueToString,
    addSpaceInString,
    localizeSpec,
  } from '$lib/utils/helpers';
  import ImageContainer from './ImageContainer.svelte';
  import RatingReadOnly from './RatingReadOnly.svelte';
  import ButtonLike from './ButtonLike.svelte';
  import ButtonBuy from './ButtonBuy.svelte';
  import { session } from '$lib/session';
  import { onMount } from 'svelte';

  export let product;
  export let userid;
  export let rating;
  export let isRated;

  let isLoggedIn: boolean;
  let displaySpecs: Record<any, any> = {};
  let dialog: HTMLDialogElement, deleteDialog: HTMLDialogElement;
  let ratingValue: number;
  let notice = '';

  let productRating: number, ratingid: number;

  $: {
    if (rating && rating.length > 0) {
      productRating = rating[0].rating;
      ratingid = rating[0].ratingid;
    }
  }

  $: isLoggedIn = $session.isLoggedIn;

  let productRatingsArray: number[] = [];
  let sum: number;
  let count: number;
  let avg: number;

  let localizedSpecs: Record<any, any> = {};

  $: productid = product.productid;

  $: {
    if (product) {
      Object.keys(product).forEach((k) => {
        if (product[k]) {
          let spec = localizeSpec(k);
          if (spec) {
            localizedSpecs[spec] = product[k];
          }
        }
      });
    }
  }

  product.ratings.forEach((element: any) => {
    productRatingsArray.push(element.rating);
  });

  sum = productRatingsArray.reduce((a, b) => a + b, 0);
  count = productRatingsArray.length;
  avg = sum / count || 0;

  $: supplierName = product.suppliers.companyname;
  $: supplierLogo = product.suppliers.logo;
  $: productThumb = product.photo[0];
  $: productName = product.name;
  $: productColor = product.color;
  $: productInStock = product.instock;
  $: productDiscountAvailable = true;
  $: productDiscountAmount = product.discount || 8;
  $: productWidth = `${product.width} мм` || '';
  $: productHeight = `${product.height} мм` || '';
  $: productThickness = `${product.thickness} мм` || '';
  $: productWeight = `${product.weight} г` || '';

  $: productType = deviceEnumValueToString(product.producttype);
  $: productDisplaySize = product.displaysize + ' "' || '';
  $: productPrice = product.price;
  $: productDiscountedPrice = product.discountedprice;
  $: productPriceString = addSpaceInString(product.price.toString());

  $: productMemory = product.memoryamount
    ? `${product.memoryamount} ${memoryEnumValueToString(product.memoryunit)}`
    : '';

  $: productCpu = product.cpucores
    ? `${
        product.cpufrequency
      } ${frequencyEnumValueToString(product.cpufrequencyunit)}`
    : '';

  $: productRam = product.ramamount
    ? `${product.ramamount} ${memoryEnumValueToString(product.ramunit)}`
    : '';

  $: productSim = product.simcount ? `${product.simcount} SIM` : '';

  $: productDisplayResolution = product.displayheight
    ? product.displaywidth > product.displayheight
      ? `${product.displaywidth}x${product.displayheight}`
      : `${product.displayheight}x${product.displaywidth}`
    : '';

  $: productDisplayRefresh = product.refreshrate
    ? `${product.refreshrate} Гц`
    : '';

  $: productCamera = product.cameraresolution
    ? `${product.cameraresolution} Мп`
    : '';

  $: productFrontCamera = product.frontcameraresolution
    ? `${product.frontcameraresolution} Мп`
    : '';

  $: productBattery = product.batterycapacity
    ? `${product.batterycapacity} мА*ч`
    : '';

  onMount(() => {
    localizedSpecs['Тип продукта'] = productType;
    if (productBattery) {
      localizedSpecs['Ёмкость батареи'] = productBattery;
    }

    if (productRam) {
      localizedSpecs['Объем оперативной памяти'] = productRam;
    }
    if (productMemory) {
      localizedSpecs['Объем памяти'] = productMemory;
    }
    if (productCamera) {
      localizedSpecs['Разрешение камеры'] = productCamera;
    }
    if (productFrontCamera) {
      localizedSpecs['Разрешение фронтальной камеры'] = productFrontCamera;
    }
    if (productCpu) {
      localizedSpecs['Частота процессора'] = productCpu;
    }
    if (productDisplayResolution) {
      displaySpecs['Разрешение экрана'] = productDisplayResolution;
      delete localizedSpecs['Ширина экрана'];
      delete localizedSpecs['Высота экрана'];
    }
    if (productDisplayRefresh) {
      displaySpecs['Частота обновления'] = productDisplayRefresh;
      delete localizedSpecs['Частота обновления'];
    }
    if (productDisplaySize) {
      displaySpecs['Размер экрана'] = productDisplaySize;
      delete localizedSpecs['Размер экрана'];
    }
    if (productSim) {
      localizedSpecs['Количество SIM-карт'] = productSim;
    }
    if (productWidth) {
      localizedSpecs['Ширина'] = productWidth;
    }
    if (productHeight) {
      localizedSpecs['Высота'] = productHeight;
    }
    if (productWeight) {
      localizedSpecs['Вес'] = productWeight;
    }
    if (productThickness) {
      localizedSpecs['Толщина'] = productThickness;
    }
    localizedSpecs['Характеристики дисплея'] = displaySpecs;
  });

  const submitRating = async () => {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      notice = 'Некорректное значение оценки. Введите число от 1 до 5';
    } else if (!isRated) {
      const response = await fetch('/v1/ratings', {
        method: 'POST',
        body: JSON.stringify({
          userid,
          productid,
          ratingValue: Math.floor(ratingValue),
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        notice = 'Неизвестная ошибка. Обновите страницу и попробуйте еще раз';
      }
    } else if (isRated) {
      const response = await fetch('/v1/ratings', {
        method: 'PUT',
        body: JSON.stringify({
          ratingid,
          userid,
          ratingValue: Math.floor(ratingValue),
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        notice = 'Неизвестная ошибка. Обновите страницу и попробуйте еще раз';
      }
    }
  };

  const deleteRating = async () => {
    const response = await fetch('/v1/ratings', {
      method: 'DELETE',
      body: JSON.stringify({ ratingid, userid }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      notice = 'Неизвестная ошибка. Обновите страницу и попробуйте еще раз';
    }
  };
</script>

<svelte:head>
  <title>
    {productName}
  </title>
</svelte:head>

<section
  class="flex w-8/12 my-0 mx-auto box-border p-8 text-gray-700 flex-col gap-y-10 items-end"
>
  <section class="w-full bg-white p-8 text-gray-700 rounded-xl">
    <section class="flex">
      <ImageContainer productPhotos={product.photo} />
      <section class="flex flex-col w-full px-6 gap-y-4">
        <section class="flex w-full h-12 items-start justify-start">
          <section class="flex w-full">
            <h1 class="pb-4 w-full flex items-end gap-x-4">
              <section class="font-bold text-3xl w-max flex">
                {productType}
                {productName}
              </section>
              <a
                class="no-underline text-blue-600 hover:cursor-pointer"
                on:click={() =>
                  document.getElementById('specs')?.scrollIntoView({
                    behavior: 'smooth',
                  })}>подробнее</a
              >
            </h1>
          </section>
          <section class="w-1/5 flex justify-end mx-1">
            <a href="/search/products?q=&brand={supplierName}">
              <img
                src="/suppliers/{supplierLogo}"
                alt="supplier-logo"
                class="h-full"
              />
            </a>
          </section>
        </section>
        <section class="flex w-full py-2 gap-x-8 items-end">
          <RatingReadOnly rating={avg} ratingCount={count} height={5} />
          {#if isLoggedIn}
            {#if !isRated}
              <span
                class="text-blue-600 hover:cursor-pointer"
                on:click={() => dialog.showModal()}>Оценить</span
              >
            {:else}
              <span class="flex gap-x-4">
                Ваша оценка: <span>{productRating}</span>
              </span>
              <span
                class="text-blue-600 hover:cursor-pointer"
                on:click={() => dialog.showModal()}>Изменить</span
              >
              <span
                class="text-red-600 font-bold hover:cursor-pointer"
                on:click={() => deleteDialog.showModal()}>Удалить</span
              >
            {/if}
          {/if}
        </section>
        <section class="mt-4 w-full rounded-lg flex gap-x-4">
          <section
            class="flex items-end gap-x-1 w-full py-4 pl-4 pr-12 bg-gray-100 bg-opacity-80 rounded-lg"
          >
            <span class="font-semibold text-2xl text-blue-600"
              >{addSpaceInString(parseInt(productDiscountedPrice).toString())} &#8381;</span
            >
            {#if productDiscountAvailable}
              <span class="text-sm text-gray-600 line-through"
                >{addSpaceInString(parseInt(productPrice).toString())}</span
              >
            {/if}
          </section>
          {#if isLoggedIn}
            <section class="flex gap-x-4 items-end">
              <ButtonLike {userid} {productid} />
              <ButtonBuy {userid} {productid} />
            </section>
          {/if}
        </section>
        <section
          class="w-max flex justify-between p-4 text-md text-gray-600 items-end bg-gray-100 bg-opacity-80 rounded-lg"
        >
          <span class="text-sm"
            >В наличии:
            {#if productInStock}
              <span class=" text-green-600">да</span>
            {:else}
              <span class="text-red-600">нет</span>
            {/if}
          </span>
        </section>
        <section
          class="w-full flex justify-start p-4 text-md text-gray-600 items-end bg-opacity-80 rounded-lg gap-x-24"
        >
          <span>Цвет: <span class="font-bold">{productColor}</span> </span>
          {#if productMemory}
            <span>Память: <span class="font-bold">{productMemory}</span> </span>
          {/if}
        </section>
      </section>
    </section>
  </section>
  <section
    class="flex flex-col w-2/3 bg-white rounded-lg p-4 gap-y-4 mx-auto"
    id="specs"
  >
    {#if localizedSpecs}
      {#each Object.keys(localizedSpecs) as spec}
        {#if spec === 'Объем оперативной памяти pr-24'}
          <p class="flex w-full pl-4 justify-between">
            <span>Объем оперативной памяти</span><span
              class="w-72 flex justify-start"
              >{localizedSpecs['Объем оперативной памяти']}</span
            >
          </p>
          {#each Object.keys(displaySpecs) as spec}
            <p class="flex w-full pl-4 justify-between pr-24">
              <span class="w-72 flex justify-start">{spec}</span><span
                class="w-72 flex justify-start">{displaySpecs[spec]}</span
              >
            </p>
          {/each}
        {:else if spec === 'Характеристики дисплея'}
          <!-- skip -->
        {:else}
          <p class="flex w-full pl-4 justify-between pr-24">
            <span class="w-72 flex justify-start">{spec}</span><span
              class="w-72 flex justify-start">{localizedSpecs[spec]}</span
            >
          </p>
        {/if}
      {/each}
    {/if}
  </section>
</section>

<dialog bind:this={dialog} class="w-1/5 rounded-lg">
  <section class="w-full p-10 flex flex-col justify-between gap-y-4">
    <p class="w-full flex justify-center">Ваша оценка товара</p>
    <section class="flex w-full flex-col items-center gap-y-2">
      <input
        type="number"
        min="1"
        max="5"
        class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-2 border border-gray-300 rounded-md w-48"
        placeholder="Оценка (от 1 до 5)"
        bind:value={ratingValue}
      />
      {#if notice}
        <p class="flex w-full">{notice}</p>
      {/if}
    </section>
    <section class="flex w-full justify-around">
      <button
        class="py-2 px-6 border border-gray-300 h-max rounded-lg"
        on:click={() => dialog.close()}>Закрыть</button
      >
      <button
        class="py-2 px-6 bg-blue-600 text-white h-max rounded-lg"
        on:click={submitRating}>Сохранить</button
      >
    </section>
  </section>
</dialog>

<dialog bind:this={deleteDialog} class="w-1/5 rounded-lg">
  <section class="w-full h-48 p-10 flex flex-col justify-between">
    <p>Вы уверены что хотите удалить свою оценку?</p>
    <section class="flex w-full justify-end gap-x-12">
      <button
        on:click={() => {
          deleteDialog.close();
        }}
        class="py-2 px-8 border border-gray-300 hover:bg-blue-500 hover:text-white rounded-md"
        autofocus
      >
        Нет
      </button>
      <button
        on:click={() => {
          deleteRating();
          deleteDialog.close();
        }}
        class="py-2 px-8 border border-gray-300 bg-red-600 text-white rounded-md"
        >Да</button
      >
    </section>
  </section>
</dialog>
