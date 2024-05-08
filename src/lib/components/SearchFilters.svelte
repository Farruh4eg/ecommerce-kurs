<script lang="ts">
  import { onMount } from 'svelte';

  export let data;

  let suppliersCheckboxContainer: HTMLElement;
  let inputInStock: HTMLInputElement;

  let suppliers = data.map((x: any) => x.suppliers.companyname);

  const validateFilters = () => {
    //TODO: implement
  };

  const resetFilters = () => {
    let checkboxes = [...document.getElementsByTagName('input')].filter(
      (el) => el.type === 'checkbox'
    );
    checkboxes.forEach((el) => {
      el.checked = false;
    });

    inputInStock.checked = true;
  };

  const submitFilters = () => {
    //TODO: implement
  };
</script>

<section
  class="h-max pb-10 w-[12%] bg-white rounded-xl flex flex-col p-4 gap-y-6 items-center"
>
  <section class="flex w-full gap-x-4 items-center">
    <input
      type="checkbox"
      name="stock"
      id="stock"
      bind:this={inputInStock}
      checked
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label for="stock">В наличии</label>
  </section>
  <section class="flex w-full gap-x-4 items-center">
    <input
      type="checkbox"
      name="rating"
      id="rating"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label for="rating">Рейтинг 4 и выше</label>
  </section>
  <section class="flex flex-col w-full gap-y-4">
    <span class="font-bold">Цена</span>
    <section class="flex w-full justify-between">
      <input
        type="number"
        name="min-price"
        id="min-price"
        class="w-[45%] p-2 rounded-lg placeholder:text-xs border-gray-200 border text-sm"
        placeholder="От 50"
      />
      <input
        type="number"
        name="max-price"
        id="max-price"
        class="w-[45%] p-2 rounded-lg placeholder:text-xs border-gray-200 border text-sm"
        placeholder="До 500 000"
      />
    </section>
  </section>
  <section
    class="flex flex-col w-full gap-y-4 h-48 overflow-y-scroll"
    bind:this={suppliersCheckboxContainer}
  >
    <span class="font-bold">Производители</span>
    {#each suppliers as supplier}
      <section class="flex w-full gap-x-4 items-center">
        <input
          type="checkbox"
          name={supplier}
          id={supplier}
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for={supplier} class="text-sm">{supplier}</label>
      </section>
    {/each}
  </section>
  <section class="flex flex-col gap-y-2 w-full items-center">
    <button class="w-[98%] py-3 px-10 bg-blue-600 text-white rounded-lg">
      Применить
    </button>
    <button
      class="w-[98%] py-3 px-10 text-gray-600 rounded-lg border border-gray-300"
      on:click={resetFilters}
    >
      Сбросить
    </button>
  </section>
</section>
