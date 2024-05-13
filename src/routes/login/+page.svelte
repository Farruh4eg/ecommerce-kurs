<script lang="ts">
  import { session } from '$lib/session.js';
  import type { EventHandler } from 'svelte/elements';
  import { handleFetch } from '$lib/utils/helpers.js';
  import type { PageServerData } from '../$types';

  export let data: PageServerData;

  let isLoggedIn: boolean;
  let showPassword = false;
  let usernameInput: string;
  let passwordInput: HTMLInputElement;
  let errorElement: HTMLParagraphElement;

  $: {
    if (isLoggedIn) {
      session.set({
        isLoggedIn: true,
      });
    }
  }

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

  let submitForm: EventHandler;

  $: {
    submitForm = async () => {
      const username = usernameInput;
      const password = passwordInput.value;

      const response = await handleFetch(
        '/v1/login',
        'POST',
        { username, password },
        { 'Content-Type': 'application/json' }
      );

      if (response.ok) {
        session.set({
          isLoggedIn: true,
        });
        window.location.href = '/';
      } else if (response.status === 401) {
        errorElement.textContent = 'Неверный логин или пароль';
      } else {
        console.error(response.status);
      }
    };
  }

  const sessionUnsubscribe = session.subscribe((value) => {
    isLoggedIn = value.isLoggedIn;
  });
</script>

<section
  class="w-[30rem] bg-white justify-center flex rounded-3xl h-[36rem] mx-auto mt-24 shadow-lg"
>
  <form
    class="w-full flex flex-col p-4 gap-y-12 h-full items-center justify-center"
    on:submit|preventDefault={submitForm}
  >
    <h1 class="h-max text-3xl text-gray-700 font-bold">Вход</h1>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="username"> Логин </label>
      <input
        type="text"
        name="username"
        bind:value={usernameInput}
        minlength="4"
        class="w-7/12 box-content py-2 px-5 rounded-lg shadow-md border border-gray-300"
        required
      />
    </section>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="password"> Пароль </label>
      <input
        type="password"
        name="password"
        minlength="8"
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
    <section
      class="h-max w-7/12 p-2 box-content text-center text-red-500 text-lg"
    >
      <p bind:this={errorElement} class="text-sm"></p>
    </section>
    <button
      type="submit"
      class="bg-white py-3 rounded-xl px-10 mt-12 hover:bg-blue-500 hover:text-white shadow-md border border-gray-200"
      >Вход</button
    >
  </form>
</section>
