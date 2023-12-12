<script lang="ts">
  import StarFilled from "./StarFilled.svelte";
  import StarPartial from "./StarPartial.svelte";
  import Star from "./Star.svelte";

  export let rating: number;
  export let ratingCount: number;
  export let height: string;

  console.log(rating % 1);

  let stars = Array.from({ length: 5 }, (_, index) => index + 1);

  function getStarType(index: number): string {
    const ratingDecimal = rating % 1;

    if (index <= Math.floor(rating)) {
      return "filled";
    } else if (index === Math.ceil(rating) && ratingDecimal > 0) {
      return "partial";
    } else {
      return "hollow";
    }
  }
</script>

<section
  class="flex gap-x-2 p-1 border box-border border-gray-300 rounded-lg text-sm items-center"
>
  <section class="flex">
    {#each stars as index (index)}
      {#if getStarType(index) === "filled"}
        <StarFilled {height} />
      {:else if getStarType(index) === "partial"}
        <StarPartial percent={(rating % 1) * 100} {height} />
      {:else}
        <Star {height} />
      {/if}
    {/each}
  </section>
  <section class="flex w-full justify-end">
    {ratingCount}
  </section>
</section>
