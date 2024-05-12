<script lang="ts">
  import OrderItem from '$lib/components/OrderItem.svelte';
  import type { orders } from '@prisma/client';
  import { onMount } from 'svelte';

  export let data;
  let orders: orders[];

  onMount(async () => {
    const response = await fetch(`/v1/orders?q=${data.userid}`);
    const fetched = await response.json();
    orders = fetched.orders;
  });
</script>

<section class="flex w-full justify-center flex-col gap-y-4 items-center">
  {#if orders}
    {#each orders as order}
      <OrderItem userid={data.userid} {order} />
    {/each}
  {/if}
</section>
