<script lang="ts">
  export let productPhotos: string[];

  let currentImageSelected: HTMLImageElement | null;
  $: currentHoveredImage = productPhotos[0];
  $: currentImageSelected = null;

  const handleHoveredImage = (element: MouseEvent) => {
    const target = element.target as HTMLImageElement;

    if (currentImageSelected && currentImageSelected !== target) {
      currentImageSelected.classList.remove('border-blue-600', 'border-l');
    }

    target.classList.add('border-blue-600', 'border-l');

    currentImageSelected = target;
    currentHoveredImage = target.src;
  };
</script>

<section class="flex">
  <section class="flex flex-col w-20 gap-4">
    {#each productPhotos as photo}
      <img src={photo} alt="product-photo" on:mouseover={handleHoveredImage} />
    {/each}
  </section>
  <section class="h-[500px] w-[500px] mx-8">
    <img src={currentHoveredImage} alt="current-picked-photo" class="h-full" />
  </section>
</section>
