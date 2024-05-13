<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { debounce } from '$lib/utils/helpers.js';
  export let data;

  let searchValue: string = '';
  let url = $page.url.searchParams;
  let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
  let totalPages = writable(1);
  $: searchType = 'SMARTPHONE';
  $: producttype = writable(url.get('type') || searchType);
  let products: Writable<any> = writable([]);
  let newProducts: Record<string, any> = {};

  const updateNewValue = (productId: string, header: string, value: any) => {
    if (!newProducts[productId]) {
      newProducts[productId] = {};
    }
    newProducts[productId][header] = value;
  };

  const deleteProduct = async (productid: string) => {
    const response = await fetch(`/v1/products?q=${productid}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.href = '/admin/products';
    }
  };

  const saveChanges = async () => {
    const requestBody = newProducts;
    try {
      const response = await fetch('/v1/products', {
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

  let tableHeaders: string[] = [
    'productid',
    'name',
    'price',
    'instock',
    'discountavailable',
    'discount',
    'supplierid',
    'releaseyear',
    'color',
    'photo',
    'Действие',
  ];

  let defaultProducts: Record<string, any> = {};

  const _fetchProductData = async () => {
    const response = await fetch(
      `/v1/products?q=${searchValue}&page=${$pageN}&type=${$producttype}`
    );
    const { products: resProducts, totalPages: resTotalPages } =
      await response.json();
    products.set(resProducts);
    resProducts.forEach((el: Record<string, any>) => {
      defaultProducts[el.productid] = el;
    });
    console.log(resProducts);
    totalPages.set(resTotalPages);
  };

  const debouncedFetchData = debounce(_fetchProductData, 400);

  onMount(async () => {
    await _fetchProductData();
  });

  $: {
    searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
  }

  $: {
    totalPages.set(data.products.totalPages);
    console.log($totalPages);
    console.log(newProducts);
  }
</script>

<section class="flex w-full justify-center mt-4 gap-x-4">
  <input
    type="text"
    name="search-user"
    id="search-user"
    placeholder="Введите данные для поиска"
    class="box-border bg-white p-2 text-sm hover:border h-12 w-96 border border-gray-500"
    bind:value={searchValue}
    on:input={() => {
      debouncedFetchData();
    }}
  />
  <select
    name="product-type"
    id="product-type"
    bind:value={searchType}
    on:change={() => {
      producttype.set(searchType);
      _fetchProductData();
    }}
    class="px-2"
  >
    <option value="SMARTPHONE" selected>Смартфон</option>
    <option value="TABLET">Планшет</option>
    <option value="CELLPHONE">Сотовый телефон</option>
    <option value="CABLE">Кабель</option>
    <option value="CHARGER">Зарядное устройство</option>
    <option value="WATCH">Часы</option>
    <option value="PLAYER">Плеер</option>
    <option value="HEADPHONE">Наушники</option>
  </select>
</section>
<section class="flex w-full justify-center">
  <section class="flex w-full justify-center overflow-x-scroll">
    <table class="border-collapse mt-10 bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="bg-gray-300 py-2 px-4 text-left border border-gray-300"
          ></th>
          {#if $products}
            {#each $products as product (product.productid)}
              <th class="py-2 px-4 text-left border border-gray-300"
                >{product.name}</th
              >
            {/each}
          {/if}
        </tr>
      </thead>
      <tbody>
        {#if tableHeaders}
          {#each tableHeaders as header}
            <tr>
              <td class="py-2 px-4 border border-gray-300">{header}</td>
              {#if $products}
                {#each $products as product}
                  <td class="py-2 px-4 border border-gray-300">
                    {#if header === 'instock' || header === 'discountavailable'}
                      <input
                        type="checkbox"
                        checked={product[header]}
                        on:change={(e) =>
                          updateNewValue(
                            product.productid,
                            header,
                            //@ts-ignore
                            e.target.checked
                          )}
                      />
                    {:else if header === 'discount' || header === 'releaseyear' || header === 'price'}
                      <input
                        type="number"
                        bind:value={product[header]}
                        on:change={() =>
                          updateNewValue(
                            product.productid,
                            header,
                            product[header]
                          )}
                      />
                    {:else if header === 'photo'}
                      <section class="flex flex-col w-max gap-y-4">
                        {#each product.photo as photo, index}
                          <section class="w-max flex">
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png, .webp"
                              bind:value={defaultProducts[product.productid]
                                .photo[index]}
                              on:change={(e) => {
                                defaultProducts[product.productid].photo[
                                  index
                                  //@ts-ignore
                                ] = e.target.files[0]?.name;
                                updateNewValue(
                                  product.productid,
                                  header,
                                  product[header]
                                );
                              }}
                            />
                            <span
                              >{defaultProducts[product.productid].photo[
                                index
                              ]}</span
                            >
                          </section>
                        {/each}
                      </section>
                    {:else if header !== 'Действие'}
                      <input
                        type="text"
                        bind:value={product[header]}
                        on:change={() =>
                          updateNewValue(
                            product.productid,
                            header,
                            product[header]
                          )}
                        disabled={header === 'productid'}
                      />
                    {:else}
                      <a
                        class={'py-2 px-4 text-left font-bold hover:cursor-pointer text-red-600'}
                        on:click={() => deleteProduct(product.productid)}
                        >Удалить</a
                      >
                    {/if}
                  </td>
                {/each}
              {/if}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </section>
</section>

<section class="flex h-max justify-center gap-x-48 mt-16">
  <button
    class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
    disabled={$pageN === 1}
    on:click={() => {
      $pageN--;
      _fetchProductData();
    }}>Назад</button
  >
  <button
    class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
    disabled={$pageN === $totalPages}
    on:click={() => {
      $pageN++;
      _fetchProductData();
    }}>Вперед</button
  >
  <button
    class="bg-blue-600 py-4 px-8 text-white rounded-lg"
    on:click={saveChanges}>Сохранить изменения</button
  >
</section>
