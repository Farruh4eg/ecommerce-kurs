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

  let defaultSuppliers: Record<string, any> = {};
  let newSuppliers: Record<string, any> = {};

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

  const debouncedFetchData = debounce(_fetchSupplierData, 400);

  const updateNewValue = (supplierid: number, header: string, value: any) => {
    if (!newSuppliers[supplierid]) {
      newSuppliers[supplierid] = {};
    }
    newSuppliers[supplierid][header] = value;
    if (!newSuppliers[supplierid].hasOwnProperty('country')) {
      newSuppliers[supplierid]['country'] =
        defaultSuppliers[supplierid]['country'];
    }
    if (!newSuppliers[supplierid].hasOwnProperty('companyname')) {
      newSuppliers[supplierid]['companyname'] =
        defaultSuppliers[supplierid]['companyname'];
    }
  };

  onMount(async () => {
    await _fetchSupplierData();
  });

  $: {
    searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
  }

  $: {
    totalPages.set(data.totalPages);
    console.log($totalPages);
  }

  const deleteSupplier = async (supplierid: number) => {
    const response = await fetch(`/v1/suppliers?q=${supplierid}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    }
  };

  const saveChanges = async () => {
    const requestBody = newSuppliers;
    try {
      const response = await fetch('/v1/suppliers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        console.log('Changes saved successfully');
        window.location.reload();
      } else {
        console.error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
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
      debouncedFetchData(true);
    }}
  />
</section>
<section class="flex w-full justify-evenly overflow-x-scroll">
  <table
    class="border-collapse mt-10 bg-white border border-gray-300 w-[1280px]"
  >
    <thead>
      <tr class="bg-gray-100">
        <th class="py-2 px-4 text-left">Наименование</th>
        <th class="py-2 px-4 text-left">Тип устройств</th>
        <th class="py-2 px-4 text-left">Страна</th>
        <th class="py-2 px-4 text-left">Город</th>
        <th class="py-2 px-4 text-left">Адрес</th>
        <th class="py-2 px-4 text-left">Почта</th>
        <th class="py-2 px-4 text-left">Телефон</th>
        <th class="py-2 px-4 text-left">Индекс</th>
        <th class="py-2 px-4 text-left">Лого</th>
        <th class="py-2 px-4 text-left">Действие</th>
      </tr>
    </thead>
    <tbody>
      {#if $suppliers}
        {#each $suppliers as supplier}
          <tr class="hover:bg-gray-200">
            <td class="py-2 px-4 text-left"
              ><input
                type="text"
                name="companyname"
                bind:value={supplier.companyname}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><select
                name="producttype"
                id="producttype"
                bind:value={supplier.producttype[0]}
                class="p-2 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              >
                <option value="SMARTPHONE">Смартфон</option>
                <option value="TABLET">Планшет</option>
                <option value="CELLPHONE">Сотовый телефон</option>
                <option value="CABLE">Кабель</option>
                <option value="HEADPHONES">Наушники</option>
                <option value="WATCH">Часы</option>
                <option value="PLAYER">Плеер</option>
                <option value="CHARGER">Зарядное устройство</option>
              </select></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="text"
                name="country"
                bind:value={supplier.country}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="text"
                name="city"
                bind:value={supplier.city}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="text"
                name="address"
                bind:value={supplier.address}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="email"
                name="email"
                bind:value={supplier.email}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="text"
                name="phone"
                bind:value={supplier.phone}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="number"
                name="postalcode"
                bind:value={supplier.postalcode}
                class="border border-gray-300 w-[100px]"
                on:input={(e) =>
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.value
                  )}
              /></td
            >
            <td class="py-2 px-4 text-left"
              ><input
                type="file"
                name="logo"
                class=" w-[100px]"
                bind:value={defaultSuppliers[supplier.supplierid].logo}
                on:input={(e) => {
                  console.log(e.target.files[0]?.name);
                  updateNewValue(
                    supplier.supplierid,
                    e.target.name,
                    e.target.files[0]?.name
                  );
                }}
              />
            </td>
            <td
              class="py-2 px-4 text-left font-bold hover:cursor-pointer text-red-600 w-[100px]"
              ><a on:click={() => deleteSupplier(supplier.supplierid)}
                >Удалить</a
              ></td
            >
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</section>

<section class="flex h-max justify-center gap-x-24 mt-16">
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
    class="bg-blue-600 py-4 px-8 text-white rounded-lg disabled:bg-gray-300 disabled:text-black"
    on:click={saveChanges}
    disabled={Object.keys(newSuppliers).length > 0 ? false : true}
    >Сохранить изменения</button
  >
</section>
