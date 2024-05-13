<script lang="ts">
  import { onMount } from 'svelte';

  let product: Record<string, any> = {};

  const fields = [
    'name',
    'price',
    'instock',
    'photo',
    'supplierid',
    'producttype',
    'discountavailable',
    'discount',
    'releaseyear',
    'color',
    'memoryamount',
    'memoryunit',
    'sdslot',
    'cameracount',
    'cameraresolution',
    'frontcameraresolution',
    'os',
    'osversion',
    'cpumodel',
    'cpucores',
    'cpufrequency',
    'cpufrequencyunit',
    'ramamount',
    'ramunit',
    'simcount',
    'simtype',
    'displaysize',
    'displayheight',
    'displaywidth',
    'refreshrate',
    'batterytype',
    'batterycapacity',
    'width',
    'height',
    'thickness',
    'weight',
    'length',
    'iswired',
    'connection',
    'chargingpower',
  ];

  onMount(() => {
    [...document.getElementsByTagName('input')].forEach((el) => {
      if (['name', 'price', 'instock', 'producttype'].includes(el.name)) {
        el.required = true;
      }
    });
  });

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    for (const field of fields) {
      if (field === 'photo') {
        const files = formData.getAll(field);
        product[field] = Array.from(files);
      } else {
        const value = formData.get(field);
        if (value !== null) {
          if (
            [
              'price',
              'discount',
              'memoryamount',
              'cameracount',
              'supplierid',
              'releaseyear',
              'cameraresolution',
              'frontcameraresolution',
              'cpucores',
              'simcount',
              'displaysize',
              'displayheight',
              'displaywidth',
              'refreshrate',
              'batterycapacity',
              'width',
              'height',
              'thickness',
              'weight',
              'cpufrequency',
              'ramamount',
              'length',
              'chargingpower',
            ].includes(field)
          ) {
            product[field] = parseFloat(value as string);
          } else if (
            ['instock', 'discountavailable', 'sdslot', 'iswired'].includes(
              field
            )
          ) {
            product[field] = value === 'on';
          } else {
            product[field] = value;
          }
        }
      }
    }

    let photos: string[] = [];

    product.photo.forEach((el: File) => {
      if (el) {
        photos.push(el.name);
      }
    });

    product.photo = photos;

    const response = await fetch('/v1/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });

    if (response.ok) {
      window.location.reload();
    }
  };
</script>

<form
  autocomplete="off"
  class="w-full flex justify-center p-4"
  on:submit={handleSubmit}
>
  <section class="flex flex-col gap-y-8 w-1/2">
    {#each fields as field}
      {#if field === 'name' || field === 'color' || field === 'os' || field === 'osversion' || field === 'cpumodel' || field === 'batterytype'}
        <input
          type="text"
          id={field}
          name={field}
          class="p-4"
          placeholder={field}
        />
      {:else if field === 'producttype'}
        <select
          name="producttype"
          id="producttype"
          class="p-4 bg-gray-200 w-max"
        >
          <option label="Product type"></option>
          <option value="SMARTPHONE">Смартфон</option>
          <option value="TABLET">Планшет</option>
          <option value="CELLPHONE">Сотовый телефон</option>
          <option value="CHARGER">Зарядное устройство</option>
          <option value="CABLE">Кабель</option>
          <option value="PLAYER">Плеер</option>
          <option value="WATCH">Часы</option>
          <option value="HEADPHONE">Наушники</option>
        </select>
      {:else if field === 'simtype'}
        <select name="simtype" id="simtype" class="p-4 bg-gray-200 w-max">
          <option label="SIM type"></option>
          <option value="ESIM">eSIM</option>
          <option value="NANO_SIM">Nano-SIM</option>
          <option value="MINI_SIM">Mini-SIM</option>
          <option value="MICRO_SIM">Micro-SIM</option>
        </select>
      {:else if field === 'ramunit' || field === 'memoryunit'}
        <select name={field} id={field} class="p-4 bg-gray-200 w-max">
          <option label="Memory unit"></option>
          <option value="TB">ТБ</option>
          <option value="GB" selected>ГБ</option>
          <option value="MB">МБ</option>
          <option value="KB">КБ</option>
        </select>
      {:else if field === 'cpufrequencyunit'}
        <select name={field} id={field} class="p-4 bg-gray-200 w-max">
          <option label="CPU frequency unit"></option>
          <option value="GHz">ГГц</option>
          <option value="MHz">МГц</option>
          <option value="KHz">КГц</option>
          <option value="Hz">Гц</option>
        </select>
      {:else if field === 'connection'}
        <select name="connection" id="connection" class="p-4 bg-gray-200 w-max">
          <option label="Connection type"></option>
          <option value="WIFI"></option>
          <option value="BLUETOOTH"></option>
          <option value="USB"></option>
          <option value="JACK"></option>
        </select>
      {:else if field === 'instock' || field === 'discountavailable' || field === 'sdslot'}
        <section class="flex gap-x-4 bg-white px-4 py-2 text-lg">
          <span>{field}</span>
          <input type="checkbox" name={field} id={field} class="scale-150" />
        </section>
      {:else if field === 'photo'}
        <section class="flex w-full gap-y-4">
          <input
            type="file"
            name="photo"
            id="photo"
            multiple
            accept=".jpg, .jpeg, .png, .webp"
          />
          <span>Фото товара</span>
        </section>
      {:else}
        <input
          type="number"
          step="0.1"
          name={field}
          id={field}
          class="p-4"
          placeholder="{field} (число)"
          min="0"
        />
      {/if}
    {/each}
    <button type="submit" class="bg-blue-600 py-4 px-8 w-max text-white"
      >Добавить</button
    >
  </section>
</form>
