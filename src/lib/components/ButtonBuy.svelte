<script lang="ts">
  import { handleFetch } from '$lib/utils/helpers';
  import { onMount } from 'svelte';

  export let userid: string;
  export let productid: string;

  let buyButton: HTMLButtonElement;

  $: buttonText = 'Купить';
  $: hoverColor = 'bg-blue-600';

  $: isInCart = false;

  onMount(async () => {
    const response = await fetch('/v1/cart', {
      method: 'GET',
    });

    const data = (await response.json()) as [{ productid: string }] | null;

    if (data?.some((item) => item.productid === productid)) {
      isInCart = true;
      buttonText = 'В корзине';
      hoverColor = 'bg-red-600';
    } else {
      isInCart = false;
      buttonText = 'Купить';
      hoverColor = 'bg-blue-600';
    }
  });

  const manageCart = async () => {
    if (isInCart) {
      window.location.href = '/cart';
    } else {
      await handleFetch(
        '/v1/cart',
        'POST',
        {
          userid,
          productid,
        },
        {
          'Content-Type': 'applicaton/json',
        }
      );
      isInCart = true;
      buttonText = 'В корзине';
      hoverColor = 'bg-red-600';
    }
  };
</script>

<button
  on:click={manageCart}
  bind:this={buyButton}
  class="p-4 border border-solid border-gray-300 w-32 rounded-xl hover:bg-blue-600 hover:text-white"
>
  {buttonText}
</button>
