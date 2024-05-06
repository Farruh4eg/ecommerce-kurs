<script lang="ts">
  import { handleSubmit } from '$lib/utils/helpers';
  import { onMount } from 'svelte';

  export let userid: string;
  export let productid: string;

  let deleteButton: HTMLButtonElement;

  $: buttonText = 'Удалить';

  onMount(async () => {
    const response = await fetch('/v1/cart', {
      method: 'GET',
    });

    const data = (await response.json()) as [{ productid: string }] | null;

    console.log(data);
  });

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
</script>

<button
  on:click={deleteItem}
  bind:this={deleteButton}
  class="p-4 border border-solid border-gray-300 w-32 rounded-xl hover:bg-red-600 hover:text-white"
>
  {buttonText}
</button>
