<script lang="ts">
  import { onMount } from 'svelte';
  import type { OrderDetails } from '$lib/utils/interfaces.js';

  import {
    addSpaceInString,
    deviceEnumValueToString,
  } from '$lib/utils/helpers.js';

  export let order;
  export let user;

  let orderdetails: OrderDetails[];
  let sum: number = 0;
  let isFolded: boolean = true;

  onMount(async () => {
    const response = await fetch(
      `/v1/orders?q=${user.userid}&order=${order.orderid}`
    );
    const fetched = await response.json();
    ({ orderdetails } = fetched);

    orderdetails.forEach((el) => {
      sum += el.total;
    });
  });
</script>

{#if orderdetails}
  <section
    class="flex flex-col w-2/5 bg-white p-4 mt-4 rounded-lg border border-gray-200"
  >
    <section class="flex flex-col gap-y-4">
      <section class="flex gap-x-6 w-full items-center">
        <a on:click={() => (isFolded = !isFolded)} class="hover:cursor-pointer"
          ><span class="font-semibold"
            >Заказ №-{order.orderid.toString().padStart(10, '0')}</span
          >
          от {new Date(order.orderdate?.split('T')[0]).toLocaleString('ru-RU', {
            dateStyle: 'short',
          })}</a
        >
        <span
          class={'text-sm font-bold ' +
            (order.fulfilled === true
              ? 'text-green-600'
              : 'text-orange-500 bg-orange-200 py-[0.3rem] px-[0.45rem] rounded-md')}
          >{order.fulfilled === true ? 'Завершен' : 'Выполняется'}</span
        >
        {#if isFolded}
          <svg
            on:click={() => (isFolded = !isFolded)}
            fill="#000000"
            height="16"
            class="ml-auto mr-10 hover:cursor-pointer"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 330 330"
            xml:space="preserve"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              ></path>
            </g></svg
          >
        {:else}
          <svg
            on:click={() => (isFolded = !isFolded)}
            fill="#000000"
            height="16"
            class="ml-auto mr-10 hover:cursor-pointer"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 330 330"
            xml:space="preserve"
            transform="matrix(1, 0, 0, -1, 0, 0)"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              ></path>
            </g></svg
          >
        {/if}
      </section>
      {#if isFolded}
        <section class="border-t border-gray-300 flex w-full justify-between">
          <section
            class="overflow-x-scroll no-scrollbar gap-x-4 p-2 flex w-full"
          >
            {#each orderdetails as orderdetail}
              <section class="flex min-w-[10%]">
                <a
                  href="/products/{orderdetail.products.productid}"
                  data-sveltekit-reload
                >
                  <img
                    class="h-20"
                    src="/products/{orderdetail.products.photo[0]}"
                    alt=""
                  />
                </a>
              </section>
            {/each}
          </section>
          <section
            class="flex flex-col justify-start pt-4 font-bold text-lg min-w-[15%] items-end"
          >
            <span>{addSpaceInString(sum.toString())}&#8381;</span>
          </section>
        </section>
      {:else}
        <section
          class="flex flex-col gap-y-4 w-full border-t border-gray-300 pt-4"
        >
          {#each orderdetails as orderdetail}
            <section class="flex justify-between border-t border-gray-300 pt-2">
              <section class="flex">
                <a
                  href="/products/{orderdetail.products.productid}"
                  class="w-36 flex justify-center"
                  data-sveltekit-reload
                >
                  <img
                    class="h-20"
                    src="/products/{orderdetail.products.photo[0]}"
                    alt=""
                  />
                </a>

                <a
                  href="/products/{orderdetail.products.productid}"
                  class="flex h-max"
                  >{deviceEnumValueToString(orderdetail.products.producttype)}
                  {orderdetail.products.name}
                  {orderdetail.products.releaseyear}
                  {orderdetail.products.color}</a
                >
              </section>
              <section
                class="flex flex-col justify-start min-w-[15%] items-end"
              >
                <span
                  >Цена: <span class="font-bold"
                    >{addSpaceInString(
                      orderdetail.total.toString()
                    )}&#8381;</span
                  ></span
                >
                <span class="text-sm"
                  >{orderdetail.quantity} шт. x {addSpaceInString(
                    orderdetail.products.discountedprice.toString()
                  )}&#8381;</span
                >
              </section>
            </section>
          {/each}
        </section>
      {/if}
    </section>
  </section>
{/if}
