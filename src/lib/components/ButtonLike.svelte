<script lang="ts">
  import { handleSubmit } from '$lib/utils/helpers';
  import { onMount } from 'svelte';
  import { wishlistCountStore } from '$lib/session';

  export let userid: string;
  export let productid: string;

  $: isLiked = false;

  const fillHeart = async () => {
    const response = await fetch('/v1/wishlist', {
      method: 'GET',
    });

    const data = (await response.json()) as [{ productid: string }] | null;

    if (data?.some((item) => item.productid === productid)) {
      isLiked = true;
      wishlistCountStore.update((value) => value + 1);
    } else {
      isLiked = false;
      wishlistCountStore.update((value) => value - 1);
    }
  };

  onMount(async () => {
    fillHeart();
  });

  const addToLiked = async () => {
    if (isLiked) {
      await handleSubmit(
        '/v1/wishlist',
        'DELETE',
        {
          userid,
          productid,
        },
        {
          'Content-Type': 'applicaton/json',
        }
      );
      isLiked = false;
      wishlistCountStore.update((value) => value - 1);
    } else {
      await handleSubmit(
        '/v1/wishlist',
        'POST',
        {
          userid,
          productid,
        },
        {
          'Content-Type': 'applicaton/json',
        }
      );
      isLiked = true;
      wishlistCountStore.update((value) => value + 1);
    }
  };
</script>

<button
  on:click={addToLiked}
  class="p-4 border border-solid border-gray-300 w-16 h-16 rounded-xl hover:bg-gray-50 flex justify-center items-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke-width="1.0"
    stroke="gray"
    fill={isLiked ? 'blue' : 'none'}
    class="h-8"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
</button>
