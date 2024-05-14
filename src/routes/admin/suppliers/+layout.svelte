<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let editButton: HTMLButtonElement, createButton: HTMLButtonElement;

  let pathname: string;
  $: pathname = $page.url.pathname;

  onMount(() => {
    if (pathname.includes('edit')) {
      editButton.disabled = true;
    } else if (pathname.includes('create')) {
      createButton.disabled = true;
    }
  });
</script>

<slot />
<section>
  <section class="flex gap-x-4 w-full justify-center my-8">
    <section class="sticky flex gap-x-4">
      <button
        class="py-4 px-6 border border-gray-400 bg-white rounded-md disabled:bg-blue-600 disabled:text-white"
        bind:this={editButton}
        on:click={() => (window.location.href = '/admin/suppliers/edit')}
        >Редактировать</button
      >
      <button
        class="py-4 px-6 border border-gray-400 bg-white rounded-md disabled:bg-blue-600 disabled:text-white"
        bind:this={createButton}
        on:click={() => (window.location.href = '/admin/suppliers/create')}
        >Добавить</button
      >
    </section>
  </section>
</section>
