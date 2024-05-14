<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let usersButton: HTMLButtonElement,
    productsButton: HTMLButtonElement,
    suppliersButton: HTMLButtonElement;

  let pathname: string;
  $: pathname = $page.url.pathname;

  onMount(() => {
    if (pathname.includes('users')) {
      usersButton.disabled = true;
    } else if (pathname.includes('products')) {
      productsButton.disabled = true;
    } else if (pathname.includes('suppliers')) {
      suppliersButton.disabled = true;
    }
  });
</script>

<slot />
<section>
  <section class="flex gap-x-4 w-full justify-center my-8">
    <section class="sticky flex gap-x-4">
      <button
        class="py-4 px-6 border border-gray-400 bg-white rounded-md disabled:bg-blue-600 disabled:text-white"
        bind:this={usersButton}
        on:click={() => (window.location.href = '/admin/users')}
        >Пользователи</button
      >
      <button
        class="py-4 px-6 border border-gray-400 bg-white rounded-md disabled:bg-blue-600 disabled:text-white"
        bind:this={productsButton}
        on:click={() => (window.location.href = '/admin/products/edit')}
        >Товары</button
      >
      <button
        class="py-4 px-6 border border-gray-400 bg-white rounded-md disabled:bg-blue-600 disabled:text-white"
        bind:this={suppliersButton}
        on:click={() => (window.location.href = '/admin/suppliers/edit')}
        >Поставщики</button
      >
    </section>
  </section>
</section>
