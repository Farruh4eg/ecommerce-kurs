<script lang="ts">
  import '../app.css';
  import SearchSuggestions from '$lib/components/SearchSuggestions.svelte';
  import { session, wishlistCountStore } from '$lib/session';
  import type { EventHandler, FormEventHandler } from 'svelte/elements';
  import { onDestroy, onMount } from 'svelte';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  import type { UserCookieInfo } from '$lib/utils/interfaces';
  import { debounce } from '../lib/utils/helpers';

  injectSpeedInsights();

  type Data = {
    userInfo: UserCookieInfo;
    wishlistCount: number;
  };
  export let data: Data;

  let wishlistCount: number;
  let isLoggedIn: boolean;
  let privileges: string;

  let usernameInput: HTMLInputElement;
  let showPassword = false;
  let passwordInput: HTMLInputElement;

  let errorElement: HTMLParagraphElement;
  let loginDialog: HTMLDialogElement;

  let searchElement: HTMLInputElement;

  $: product = [];

  $: isFocused = false;
  $: isSuggestionsVisible = isFocused && product.length > 0;
  $: {
    if (isLoggedIn) {
      session.set({
        isLoggedIn: true,
      });
    }

    privileges = data?.userInfo?.privileges;
    if (!privileges) {
      session.set({
        isLoggedIn: false,
      });
    } else if (privileges) {
      session.set({
        isLoggedIn: true,
      });
    }
  }

  let submitForm: EventHandler;

  $: {
    submitForm = async () => {
      const username = usernameInput;
      const password = passwordInput.value;

      const response = await fetch('/v1/login', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        session.set({
          isLoggedIn: true,
        });
        window.location.href = '/';
      } else if (response.status === 401) {
        errorElement.textContent = 'Неверный логин или пароль';
      } else if (response.status === 404) {
        errorElement.textContent = 'Пользователя не существует';
      }
    };
  }

  const handleFocusChange = () => {
    setTimeout(() => {
      isFocused = !isFocused;
      if (isFocused) {
        searchElement.classList.add('rounded-b-none');
      } else if (!isFocused) {
        searchElement.classList.remove('rounded-b-none');
      }
    }, 150);
  };

  const handleLogout = async () => {
    const response = await fetch('/v1/logout', {
      method: 'POST',
      headers: {
        credentials: 'same-origin',
      },
    });
    if (response.ok) {
      session.set({
        isLoggedIn: false,
      });
      window.location.href = '/';
    }
  };

  const handleShowPassword = () => {
    switch (passwordInput.type) {
      case 'password':
        passwordInput.type = 'text';
        break;
      case 'text':
        passwordInput.type = 'password';
    }
    showPassword = !showPassword;
  };

  const handleDialogClick = (event: MouseEvent) => {
    if (
      event.target === loginDialog &&
      !loginDialog.contains(event.relatedTarget as Node)
    ) {
      loginDialog.close();
    }
  };

  const deleteFiltersFromStorage = () => {
    const filters = localStorage.getItem('searchFilters');
    if (filters) {
      localStorage.removeItem('searchFilters');
    }
  };

  const handleRegisterClick = () => {
    window.location.href = `/register/`;
  };

  const _fetchData: FormEventHandler<HTMLInputElement> = async (
    data,
    page: number = 1
  ) => {
    const inputData = (data.target as HTMLInputElement).value
      .trim()
      .replaceAll(/['"`;%|]/g, '');
    if (inputData.length > 0) {
      const request = await fetch(`/v1/products?q=${inputData}&page=${page}`);
      const json = await request.json();
      product = json.products;
    } else {
      product = [];
    }
  };

  const debouncedFetchData = debounce(_fetchData, 400);

  const sessionUnsubscribe = session.subscribe((value) => {
    isLoggedIn = value.isLoggedIn;
  });

  const wishlistCountUnsubscribe = wishlistCountStore.subscribe((value) => {
    wishlistCount = value;
  });

  onDestroy(() => {
    sessionUnsubscribe();
    wishlistCountUnsubscribe();
  });

  const showDialog = () => {
    loginDialog.showModal();
  };
</script>

<nav
  class="h-28 flex p-2 items-center gap-x-4 w-full content-center bg-white justify-evenly sticky 2xl:my-0 2xl:mx-auto 2xl:justify-center z-[1000]"
>
  <a
    on:click={deleteFiltersFromStorage}
    href="/"
    class="bg-blue-600 h-max p-5 text-gray-200 rounded-xl hover:opacity-80 transition-opacity w-36 text-center"
    data-sveltekit-reload>Главная</a
  >
  <search class="flex gap-x-1 justify-center relative">
    <form
      autocomplete="off"
      on:submit={() => {
        window.location.href = `/search/products?q=${searchElement.value.trim()}&page=1`;
      }}
      class="w-full flex justify-center gap-x-2 content-center items-center"
    >
      <input
        on:focusin={handleFocusChange}
        on:focusout={handleFocusChange}
        on:input={debouncedFetchData}
        required
        bind:this={searchElement}
        type="search"
        placeholder="Поиск по магазину"
        class="relative box-border bg-gray-100 hover:bg-white p-5 rounded-xl text-sm hover:shadow-xl transition-all hover:border hover:border-gray-100 h-16 w-96"
        id="search"
        name="q"
      />
      {#if isSuggestionsVisible}
        <SearchSuggestions data={product} />
      {/if}
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
  <section class="flex justify-around">
    {#if isLoggedIn}
      <a
        href="/wishlist/"
        data-sveltekit-reload
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="blue"
          fill="none"
          class="h-7 relative"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        {#if wishlistCount > 0}
          <a id="wishlist-counter">
            <span
              class="z-40 absolute bottom-14 right-10 text-white font-bold text-[12px] bg-blue-600 rounded-full px-[0.3rem] inline-flex justify-center content-center items-center"
            >
              {wishlistCount}
            </span>
          </a>
        {/if}
        Избранное</a
      >

      <a
        href="/cart/"
        data-sveltekit-reload
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
    {/if}
    {#if !isLoggedIn}
      <a
        href="/register"
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        data-sveltekit-reload
        ><svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          class="h-7"
          ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g><g id="SVGRepo_iconCarrier">
            <title>i</title>
            <g id="Complete">
              <g id="user-add">
                <g>
                  <path
                    d="M17,21V19a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4v2"
                    fill="none"
                    stroke="#0000FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.9440000000000002"
                  ></path>
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    fill="none"
                    stroke="#0000FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.9440000000000002"
                  ></circle>
                  <line
                    x1="17"
                    y1="11"
                    x2="23"
                    y2="11"
                    fill="none"
                    stroke="#0000FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.9440000000000002"
                  ></line>
                  <line
                    x1="20"
                    y1="8"
                    x2="20"
                    y2="14"
                    fill="none"
                    stroke="#0000FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.9440000000000002"
                  ></line>
                </g>
              </g>
            </g>
          </g></svg
        >Регистрация</a
      >
      <button
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        on:click={showDialog}
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
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
        Войти</button
      >
    {:else if isLoggedIn}
      <a
        href="/orders"
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        data-sveltekit-reload
      >
        <svg
          viewBox="0 0 1024 1024"
          fill="#0000FA"
          class="icon h-7"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#0000FA"
          ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g><g id="SVGRepo_iconCarrier"
            ><path
              d="M300 462.4h424.8v48H300v-48zM300 673.6H560v48H300v-48z"
              fill=""
            ></path><path
              d="M818.4 981.6H205.6c-12.8 0-24.8-2.4-36.8-7.2-11.2-4.8-21.6-11.2-29.6-20-8.8-8.8-15.2-18.4-20-29.6-4.8-12-7.2-24-7.2-36.8V250.4c0-12.8 2.4-24.8 7.2-36.8 4.8-11.2 11.2-21.6 20-29.6 8.8-8.8 18.4-15.2 29.6-20 12-4.8 24-7.2 36.8-7.2h92.8v47.2H205.6c-25.6 0-47.2 20.8-47.2 47.2v637.6c0 25.6 20.8 47.2 47.2 47.2h612c25.6 0 47.2-20.8 47.2-47.2V250.4c0-25.6-20.8-47.2-47.2-47.2H725.6v-47.2h92.8c12.8 0 24.8 2.4 36.8 7.2 11.2 4.8 21.6 11.2 29.6 20 8.8 8.8 15.2 18.4 20 29.6 4.8 12 7.2 24 7.2 36.8v637.6c0 12.8-2.4 24.8-7.2 36.8-4.8 11.2-11.2 21.6-20 29.6-8.8 8.8-18.4 15.2-29.6 20-12 5.6-24 8-36.8 8z"
              fill=""
            ></path><path
              d="M747.2 297.6H276.8V144c0-32.8 26.4-59.2 59.2-59.2h60.8c21.6-43.2 66.4-71.2 116-71.2 49.6 0 94.4 28 116 71.2h60.8c32.8 0 59.2 26.4 59.2 59.2l-1.6 153.6z m-423.2-47.2h376.8V144c0-6.4-5.6-12-12-12H595.2l-5.6-16c-11.2-32.8-42.4-55.2-77.6-55.2-35.2 0-66.4 22.4-77.6 55.2l-5.6 16H335.2c-6.4 0-12 5.6-12 12v106.4z"
              fill=""
            ></path></g
          ></svg
        >
        Заказы</a
      >
      <a
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        href="/profile/"
        data-sveltekit-reload
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
        {data?.userInfo?.username}</a
      >
      {#if data?.userInfo?.privileges === 'admin' || data?.userInfo?.privileges === 'mod'}
        <a
          class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
          href="/admin/users"
          data-sveltekit-reload
          ><svg
            fill="#0000FF"
            class="h-7"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
            stroke="#0000FF"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <path
                    d="M235.082,392.745c-5.771,0-10.449,4.678-10.449,10.449v4.678c0,5.771,4.678,10.449,10.449,10.449 c5.77,0,10.449-4.678,10.449-10.449v-4.678C245.531,397.423,240.853,392.745,235.082,392.745z"
                  ></path>
                </g>
              </g>
              <g>
                <g>
                  <path
                    d="M492.948,313.357l-31.393-25.855c1.58-10.4,2.38-20.968,2.38-31.502c0-10.534-0.8-21.104-2.381-31.504l31.394-25.856 c10.032-8.262,12.595-22.42,6.099-33.66L456.35,91.029c-4.704-8.173-13.479-13.25-22.903-13.25c-3.19,0-6.326,0.573-9.302,1.695 l-38.109,14.274c-16.546-13.286-34.848-23.869-54.55-31.54l-6.683-40.082C322.676,9.306,311.701,0,298.704,0h-85.408 C200.3,0,189.324,9.307,187.2,22.119l-6.684,40.088c-19.703,7.673-38.007,18.255-54.553,31.542L87.898,79.492 c-2.999-1.138-6.14-1.715-9.338-1.715c-9.414,0-18.191,5.074-22.903,13.241l-42.702,73.96 c-6.499,11.244-3.935,25.403,6.097,33.664l31.394,25.855c-1.58,10.4-2.38,20.969-2.38,31.503c0,10.534,0.8,21.103,2.38,31.503 l-31.394,25.856c-10.032,8.262-12.595,22.42-6.099,33.66l42.703,73.963c4.716,8.171,13.492,13.247,22.904,13.247 c3.205,0,6.352-0.581,9.294-1.703l38.107-14.275c16.547,13.287,34.85,23.87,54.551,31.541l6.682,40.075 C189.316,502.692,200.293,512,213.297,512h85.408c12.991,0,23.967-9.304,26.096-22.118l6.683-40.089 c19.705-7.673,38.008-18.255,54.554-31.542l38.07,14.261c2.999,1.137,6.141,1.713,9.336,1.713c9.411,0,18.185-5.074,22.9-13.241 l42.703-73.962C505.543,335.776,502.979,321.619,492.948,313.357z M298.704,491.102H245.53v-49.427 c0-5.771-4.678-10.449-10.449-10.449c-5.771,0-10.449,4.678-10.449,10.449v49.427h-10.922V376.504 c13.606,4.844,28.061,7.375,42.865,7.382c0.003,0,0.066,0,0.07,0c14.852,0,29.325-2.528,42.928-7.376v114.515h0.001 C299.289,491.069,299,491.102,298.704,491.102z M256.642,362.988h-0.057c-58.964-0.029-106.933-48.026-106.932-106.99 c0.001-34.314,16.175-65.814,43.158-85.745v76.229c0,3.671,1.926,7.072,5.073,8.96l53.381,32.027 c3.309,1.984,7.443,1.984,10.752,0l53.381-32.027c3.147-1.889,5.073-5.29,5.073-8.96v-76.229 c26.983,19.931,43.159,51.432,43.157,85.747c0,28.528-11.143,55.382-31.374,75.614 C312.022,351.846,285.169,362.988,256.642,362.988z M480.949,336.57l-42.705,73.965c-1.326,2.296-4.122,3.423-6.769,2.42 l-43.772-16.397c-3.557-1.331-7.555-0.63-10.444,1.834c-16.925,14.428-36.026,25.589-56.79,33.212v-64.779 c9.585-5.551,18.513-12.386,26.56-20.434c24.179-24.18,37.495-56.281,37.495-90.391c0.001-48.242-26.729-91.831-69.76-113.754 c-3.239-1.651-7.103-1.498-10.203,0.401c-3.099,1.9-4.989,5.274-4.989,8.909v89.011l-42.932,25.759l-42.932-25.759v-89.011 c0-3.635-1.89-7.009-4.989-8.909c-3.099-1.899-6.963-2.05-10.203-0.401c-43.03,21.922-69.76,65.51-69.762,113.752 c-0.001,34.743,13.583,67.154,38.247,91.26c7.858,7.68,16.53,14.23,25.809,19.585v65.235 c-21.258-7.63-40.795-18.958-58.071-33.684c-1.922-1.638-4.333-2.497-6.78-2.497c-1.232,0-2.473,0.217-3.663,0.664l-43.83,16.419 c-0.613,0.234-1.255,0.353-1.905,0.353c-1.969,0-3.81-1.071-4.805-2.796l-42.706-73.968c-1.365-2.361-0.822-5.337,1.288-7.076 L68.389,299.8c2.926-2.411,4.318-6.216,3.635-9.944c-2.03-11.12-3.061-22.509-3.061-33.856c0-11.346,1.03-22.736,3.063-33.854 c0.681-3.729-0.709-7.535-3.636-9.944l-36.051-29.691c-2.112-1.74-2.654-4.716-1.287-7.08l42.705-73.966 c1.323-2.294,4.109-3.429,6.769-2.419l43.772,16.396c3.555,1.33,7.554,0.63,10.444-1.833 c17.417-14.847,37.129-26.244,58.589-33.876c3.576-1.272,6.182-4.382,6.805-8.126l7.679-46.059 c0.446-2.694,2.752-4.649,5.482-4.649h85.408c2.73,0,5.036,1.955,5.485,4.656l7.679,46.053c0.624,3.744,3.23,6.856,6.806,8.126 c21.459,7.631,41.17,19.027,58.586,33.874c2.89,2.463,6.888,3.165,10.444,1.833l43.794-16.405c0.631-0.238,1.287-0.358,1.95-0.358 c1.97,0,3.805,1.064,4.798,2.789l42.706,73.967c1.365,2.361,0.822,5.337-1.288,7.076l-36.052,29.692 c-2.926,2.411-4.318,6.215-3.635,9.944c2.03,11.118,3.061,22.509,3.061,33.855c0,11.346-1.03,22.735-3.063,33.853 c-0.681,3.728,0.709,7.535,3.636,9.944l36.051,29.691C481.774,331.227,482.316,334.205,480.949,336.57z"
                  ></path>
                </g>
              </g>
            </g></svg
          >
          Управление</a
        >
      {/if}
      <a
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500 hover: cursor-pointer"
        data-sveltekit-reload
        on:click={handleLogout}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="red"
          class="h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>

        Выйти</a
      >
    {/if}
  </section>
</nav>
<dialog
  id="loginDialog"
  bind:this={loginDialog}
  on:click={handleDialogClick}
  class="w-[30rem] justify-center rounded-3xl h-[36rem] mx-auto mt-12 shadow-lg"
>
  <form
    on:submit|preventDefault={submitForm}
    class="w-full flex flex-col p-4 gap-y-12 h-[36rem] items-center justify-center"
    id="loginForm"
  >
    <h1 class="h-max text-3xl text-gray-700 font-bold">Вход</h1>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="username"> Логин </label>
      <input
        type="text"
        name="username"
        bind:value={usernameInput}
        class="w-7/12 box-content py-2 px-5 rounded-lg shadow-md border border-gray-300"
        required
      />
    </section>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="password"> Пароль </label>
      <input
        type="password"
        name="password"
        class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 relative pr-8"
        bind:this={passwordInput}
        required
      />
      <button
        class="absolute ml-[17rem] mt-8 bg-transparent"
        on:click={handleShowPassword}
        type="button"
      >
        {#if !showPassword}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 hover:stroke-blue-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        {:else if showPassword}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 hover:stroke-blue-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        {/if}
      </button>
    </section>
    <p bind:this={errorElement}></p>
    <button
      type="submit"
      class="bg-white py-3 rounded-xl px-10 mt-12 hover:bg-blue-500 hover:text-white shadow-md border border-gray-200"
      >Вход</button
    >
    <p>
      Нет учетной записи? <a
        on:click={handleRegisterClick}
        class="text-blue-500 hover:cursor-pointer">Зарегистрируйтесь</a
      >
    </p>
  </form>
</dialog>
<slot />

<style lang="postcss">
  :global(html) {
    margin: 0;
    background-color: rgb(243, 244, 246);
    width: 100vw;
    overflow-x: hidden;
  }
</style>
