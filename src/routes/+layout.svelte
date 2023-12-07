<script>
  import { onMount } from 'svelte';
  import '../app.css';
  import SearchSuggestions from '$lib/components/SearchSuggestions.svelte';
  // @ts-nocheck

  let searchElement;
  $: width = 0;
  $: product = {};

  $: isFocused = false;

  const fetchData = async (data) => {
    const inputData = data.target.value.trim();
    if (inputData.length >= 3) {
      const request = await fetch(`/v1/products?name=${inputData}`);
      const json = await request.json();
      product = json;
    }
  };

  onMount(() => {
    const resizeObserver = new ResizeObserver(handleWidthChange);

    resizeObserver.observe(searchElement);

    return () => {
      resizeObserver.disconnect();
    };
  });

  const handleWidthChange = (entry) => {
    width = entry[0].contentRect.width;
  };
</script>

<nav
  class="h-28 flex p-2 items-center gap-x-4 w-full mx-auto justify-around content-center bg-white rounded-b-lg sticky"
>
  <a
    href="/"
    class="bg-blue-600 h-max p-5 text-gray-200 rounded-xl hover:opacity-80 transition-opacity"
    >Домой</a
  >
  <search class="flex gap-x-1 w-2/5 justify-center relative">
    <form
      action="/search/product"
      class="w-full flex justify-center gap-x-2 content-center items-center"
    >
      <input
        on:focusin={() => (isFocused = true)}
        on:focusout={() => (isFocused = false)}
        on:input={fetchData}
        bind:this={searchElement}
        type="search"
        placeholder="Поиск по магазину"
        class="relative box-content bg-gray-100 hover:bg-white p-5 rounded-xl w-full text-sm hover:shadow-xl transition-all hover:border hover:border-gray-100"
        id="search"
        name="q"
      />

      <button
        class="py-3 w-12 h-max rounded-lg hover:bg-gray-200 -ml-16 z-10 flex justify-center content-center items-center"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="gray"
          class="h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  </search>
  <a
    href="/wishlist/"
    class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      fill="none"
      class="h-7 fill-blue-600"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>Избранное</a
  >
  <a
    href="/cart/"
    class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="blue"
      class="h-7"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
    Корзина</a
  >
  <a
    href="/profile/"
    class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="blue"
      class="h-7"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
    Профиль</a
  >
</nav>
<slot />

<style lang="postcss">
  :global(html) {
    margin: 0 auto;
    width: 80vw;
    background-color: rgb(243, 244, 246);
  }
</style>
