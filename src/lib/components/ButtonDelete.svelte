<script lang="ts">
  import { handleFetch } from '$lib/utils/helpers';

  export let userid: string;
  export let productid: string;

  let deleteButton: HTMLButtonElement;
  let dialog: HTMLDialogElement;

  $: buttonText = 'Удалить';

  const deleteItem = async () => {
    await handleFetch(
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
  on:click={() => {
    dialog.showModal();
  }}
  bind:this={deleteButton}
  class="p-4 border border-solid border-gray-300 w-32 rounded-xl hover:bg-red-600 hover:text-white"
>
  {buttonText}
</button>

<dialog bind:this={dialog} class="w-1/5 rounded-lg">
  <section class="w-full h-48 p-10 flex flex-col justify-between">
    <p>Вы уверены что хотите удалить товар с вашей корзины?</p>
    <section class="flex w-full justify-end gap-x-12">
      <button
        on:click={() => dialog.close()}
        class="py-2 px-8 border border-gray-300 hover:bg-blue-500 hover:text-white"
        autofocus
      >
        Нет
      </button>
      <button
        on:click={() => {
          deleteItem();
          dialog.close();
        }}
        class="py-2 px-8 border border-gray-300 bg-red-600 text-white"
        >Да</button
      >
    </section>
  </section>
</dialog>
