<script lang="ts">
  import CartItem from '$lib/components/CartItem.svelte';
  import { get } from 'svelte/store';
  import type { PageData } from '../$types';
  import { session } from '$lib/session';
  export let data: PageData;
  let isLoggedIn: boolean;

  $: {
    isLoggedIn = get(session).isLoggedIn;
  }
</script>

<svelte:head>
  <title>Корзина</title>
</svelte:head>
<section class="flex justify-evenly gap-x-4 p-4">
  {#if !isLoggedIn}
    <p>Войдите в учетную запись чтобы иметь доступ к корзине</p>
  {:else if data.products.length === 0}
    <p>В вашей корзине пока что пусто.</p>
  {:else}
    <section class="flex flex-col gap-4 mt-6 mb-4">
      {#each data.products as product (product.productid)}
        <CartItem product={product.products} userid={data.userid} />
      {/each}
    </section>
  {/if}
</section>
