<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { debounce } from '$lib/utils/helpers.js';
  export let data;

  let suppliers: Writable<any> = writable([]);

  let searchValue: string = '';

  let url = $page.url.searchParams;
  let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
  let totalPages = writable(1);

  let newSuppliers: Writable<any> = writable([]);
  let defaultSuppliers: Record<string, any> = {};

  const _fetchSupplierData = async (getTotal = false) => {
    if (getTotal) {
      const response = await fetch(
        `/v1/suppliers?q=-1&page=${$pageN}&search=${searchValue}&total=${getTotal}`
      );

      const count = await response.json();
      totalPages.set(count);
    }
    const response = await fetch(
      `/v1/suppliers?q=-1&page=${$pageN}&search=${searchValue}`
    );
    const res = await response.json();
    suppliers.set(res);
    res.forEach((el: Record<string, string>) => {
      defaultSuppliers[el.supplierid] = el;
    });
  };

  $: console.log(data);

  const debouncedFetchData = debounce(_fetchSupplierData, 400);

  onMount(async () => {
    await _fetchSupplierData();
  });

  $: {
    searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
  }

  $: {
    totalPages.set(data.totalPages);
  }

  const deleteSupplier = async (userid: string) => {
    const response = await fetch(`/v1/user?q=${userid}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.href = '/admin/users';
    }
  };

  const editSupplier = async () => {};
</script>

<section class="flex w-full justify-center mt-4">
  <input
    type="text"
    name="search-user"
    id="search-user"
    placeholder="Введите данные для поиска"
    class="box-border bg-white p-2 text-sm hover:border h-12 w-96 border border-gray-500"
    bind:value={searchValue}
    on:input={() => {
      if (searchValue.length) debouncedFetchData(true);
    }}
  />
</section>
<section class="flex w-full justify-evenly">
  <table class="w-max border-collapse mt-10 bg-white border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        <th class="py-2 px-4 text-left">id</th>
        <th class="py-2 px-4 text-left">Наименование</th>
        <th class="py-2 px-4 text-left">Имя</th>
        <th class="py-2 px-4 text-left">Фамилия</th>
        <th class="py-2 px-4 text-left">Почта</th>
        <th class="py-2 px-4 text-left">Роль</th>
        <th class="py-2 px-4 text-left">Дата создания</th>
        <th class="py-2 px-4 text-left">Действие</th>
      </tr>
    </thead>
    <tbody>
      <!-- {#if $suppliers}
        {#each $suppliers as supplier}
          <tr class="hover:bg-gray-200">
            <td class="py-2 px-4 text-left"
              ><span>{supplier.supplierid}</span></td
            >
            <td class="py-2 px-4 text-left"><span>{supplier.companyname}</span></td
            >
            <td class="py-2 px-4 text-left"
              ><span>{supplier.firstname}</span></td
            >
            <td class="py-2 px-4 text-left"><span>{supplier.lastname}</span></td
            >
            <td class="py-2 px-4 text-left"><span>{supplier.email}</span></td>

            <td class="py-2 px-4 text-left"
              ><span>{supplier.datecreated}</span></td
            >
            <td class="py-2 px-4 text-left font-bold hover:cursor-pointer"
              ><a on:click={() => deleteSupplier(supplier.supplierid)}
                >Удалить</a
              ></td
            >
          </tr>
        {/each}
      {/if} -->
    </tbody>
  </table>
</section>

<section class="flex h-max justify-center gap-x-48 mt-16">
  <button
    class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
    disabled={$pageN === 1}
    on:click={() => {
      $pageN--;
      _fetchSupplierData();
    }}>Назад</button
  >
  <button
    class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
    disabled={$pageN === $totalPages}
    on:click={() => {
      $pageN++;
      _fetchSupplierData();
    }}>Вперед</button
  >
  <button
    class="bg-blue-600 py-4 px-8 text-white rounded-lg"
    on:click={editSupplier}>Сохранить изменения</button
  >
</section>
