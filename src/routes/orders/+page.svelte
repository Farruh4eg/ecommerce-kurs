<script lang="ts">
  import OrderItem from '$lib/components/OrderItem.svelte';
  import type { orders } from '@prisma/client';
  import { onMount } from 'svelte';

  export let data;
  let orders: orders[];

  onMount(async () => {
    const response = await fetch(
      `/v1/orders?q=${data.userInsensitiveData.userid}`
    );
    const fetched = await response.json();
    orders = fetched.orders;
  });
</script>

<section class="flex w-full justify-center flex-col gap-y-4 items-center">
  {#if orders}
    {#each orders as order}
      <OrderItem user={data.userInsensitiveData} {order} />
    {/each}
  {:else}
    <p>У вас пока что нет никаких заказов</p>
  {/if}
</section>
