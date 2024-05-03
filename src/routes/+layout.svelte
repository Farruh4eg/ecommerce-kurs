<script lang="ts">
  import '../app.css';
  import SearchSuggestions from '$lib/components/SearchSuggestions.svelte';
  import { session, wishlistCountStore, cartCountStore } from '$lib/session';
  import type { EventHandler, FormEventHandler } from 'svelte/elements';
  import { onDestroy } from 'svelte';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  import type { UserCookieInfo } from '$lib/utils/interfaces';

  injectSpeedInsights();

  type Data = {
    userInfo: UserCookieInfo;
    wishlistCount: number;
    cartCount: number;
  };

  let wishlistCount: number;
  let cartCount: number;

  export let data: Data;

  let isLoggedIn: boolean;

  let usernameInput: HTMLInputElement;
  let showPassword = false;
  let passwordInput: HTMLInputElement;

  let errorElement: HTMLParagraphElement;
  let loginDialog: HTMLDialogElement;

  let searchElement: HTMLInputElement;
  $: width = 0;
  $: product = [];

  $: isFocused = false;
  $: isSuggestionsVisible = isFocused && product.length > 0;

  let submitForm: EventHandler;

  $: {
    submitForm = async () => {
      const username = usernameInput;
      const password = passwordInput;

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

  const handleRegisterClick = () => {
    window.location.href = `/register/`;
  };

  const fetchData: FormEventHandler<HTMLInputElement> = async (data) => {
    const inputData = (data.target as HTMLInputElement).value.trim();
    if (inputData.length > 0) {
      const request = await fetch(`/v1/products?name=${inputData}`);
      const json = await request.json();
      product = json;
    } else {
      product = [];
    }
  };

  const sessionUnsubsribe = session.subscribe((value) => {
    isLoggedIn = value.isLoggedIn;
  });

  const wishlistCountUnsubscribe = wishlistCountStore.subscribe((value) => {
    wishlistCount = value;
  });

  const cartCountUnsubscribe = cartCountStore.subscribe((value) => {
    cartCount = value;
  });

  onDestroy(() => {
    sessionUnsubsribe();
    wishlistCountUnsubscribe();
    cartCountUnsubscribe();
  });

  const showDialog = () => {
    loginDialog.showModal();
  };
</script>

<nav
  class="h-28 flex p-2 items-center gap-x-4 w-full content-center bg-white justify-evenly sticky 2xl:my-0 2xl:mx-auto 2xl:justify-center"
>
  <a
    href="/"
    class="bg-blue-600 h-max p-5 text-gray-200 rounded-xl hover:opacity-80 transition-opacity w-36 text-center"
    >Главная</a
  >
  <search class="flex gap-x-1 justify-center relative">
    <form
      autocomplete="off"
      action="/search/product"
      class="w-full flex justify-center gap-x-2 content-center items-center"
    >
      <input
        on:focusin={handleFocusChange}
        on:focusout={handleFocusChange}
        on:input={fetchData}
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
    <a
      href="/wishlist/"
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
    {#if !isLoggedIn}
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
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500"
        href="/profile/"
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
      <a
        class="scale-90 hover:bg-gray-100 p-5 rounded-lg min-w-[5rem] text-center transition-colors flex flex-col text-gray-500 hover: cursor-pointer"
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
        bind:value={passwordInput}
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
