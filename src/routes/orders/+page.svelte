<script lang="ts">
  import { onMount } from 'svelte';

  export let data;

  onMount(async () => {
    const response = await fetch(`/v1/orders?q=${data.userid}`);
    const fetched = await response.json();
    console.log(fetched);
  });
</script>
