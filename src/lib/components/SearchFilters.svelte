<script lang="ts">
  import { onMount } from 'svelte';

  export let data;
  export let query;

  let suppliersCheckboxContainer: HTMLElement;
  let checkboxes: HTMLInputElement[];
  let inputInStock: HTMLInputElement,
    inputMinPrice: HTMLInputElement,
    inputMaxPrice: HTMLInputElement,
    inputRating: HTMLInputElement;

  let suppliersArray = data.map((x: any) => x.suppliers.companyname);
  let suppliersStringified: string = '';
  let inStock: string;
  let rating: string;
  let price: string;

  const loadFiltersFromStorage = () => {
    const filters = JSON.parse(localStorage.getItem('searchFilters') || '{}');
    inputInStock.checked = filters.inStock === 'true';
    inputRating.checked = filters.rating === 'good';
    inputMinPrice.value = filters.minPrice || '50';
    inputMaxPrice.value = filters.maxPrice || '500000';

    checkboxes.forEach((checkbox) => {
      checkbox.checked = filters.suppliers.includes(checkbox.name);
    });
  };

  const saveFiltersToStorage = () => {
    const filters = {
      inStock: inputInStock.checked.toString(),
      rating: inputRating.checked.toString(),
      minPrice: inputMinPrice.value,
      maxPrice: inputMaxPrice.value,
      suppliers: checkboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.name),
    };
    localStorage.setItem('searchFilters', JSON.stringify(filters));
  };

  const validateFilters = () => {
    if (
      parseInt(inputMinPrice.value) < 50 ||
      isNaN(parseInt(inputMinPrice.value))
    ) {
      inputMinPrice.value = '50';
    } else if (parseInt(inputMinPrice.value) > 499_999) {
      inputMinPrice.value = '499999';
    }

    if (
      parseInt(inputMaxPrice.value) > 500_000 ||
      parseInt(inputMaxPrice.value) < 51 ||
      isNaN(parseInt(inputMaxPrice.value))
    ) {
      inputMaxPrice.value = '500000';
    }

    inStock = inputInStock.checked === true ? 'true' : 'all';
    price = [inputMinPrice.value, inputMaxPrice.value].join('-');
    rating = inputRating.checked === true ? 'good' : 'all';
    suppliersStringified = checkboxes
      .filter((el) => el.checked)
      .map((el) => el.name)
      .join('-');
  };

  const resetFilters = () => {
    checkboxes.forEach((el) => {
      el.checked = false;
    });

    inputMinPrice.value = '50';
    inputMaxPrice.value = '500000';
  };

  const submitFilters = () => {
    validateFilters();
    saveFiltersToStorage();
    window.location.href = `/search/products?q=${query}&inStock=${inStock}&rating=${rating}&price=${price}&brand=${suppliersStringified}`;
  };

  onMount(() => {
    checkboxes = [...document.getElementsByTagName('input')].filter(
      (el) => el.type === 'checkbox'
    );
    try {
      loadFiltersFromStorage();
    } catch (e) {
      console.log('no search filters saved yet');
    }
  });
</script>

<section
  class="h-max pb-10 min-w-[12%] bg-white rounded-xl flex flex-col p-4 gap-y-6 items-center"
>
  <section class="flex w-full gap-x-4 items-center">
    <input
      type="checkbox"
      name="stock"
      id="stock"
      bind:this={inputInStock}
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label for="stock">В наличии</label>
  </section>
  <section class="flex w-full gap-x-4 items-center">
    <input
      type="checkbox"
      name="rating"
      id="rating"
      bind:this={inputRating}
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
        bind:this={inputMinPrice}
        class="w-[45%] p-2 rounded-lg placeholder:text-xs border-gray-200 border text-sm"
        placeholder="От 50"
      />
      <input
        type="number"
        name="max-price"
        id="max-price"
        bind:this={inputMaxPrice}
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
    {#each suppliersArray as supplier}
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
    <button
      class="w-[98%] py-3 px-10 bg-blue-600 text-white rounded-lg"
      on:click={submitFilters}
    >
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
