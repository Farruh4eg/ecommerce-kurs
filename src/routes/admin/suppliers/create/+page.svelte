<script lang="ts">
  import { onMount } from 'svelte';

  let supplier: Record<string, any> = {};

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    for (const f of formData) {
      if (f[0] === 'logo') {
        if ((f[1] as File).name) {
          supplier[f[0]] = (f[1] as File).name;
        }
      } else if (f[0] === 'postalcode') {
        supplier[f[0]] = parseInt(f[1] as string);
      } else {
        supplier[f[0]] = f[1];
      }
    }
    const response = await fetch('/v1/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });

    if (response.ok) {
      window.location.reload();
    }
  };
</script>

<form
  autocomplete="off"
  class="w-full flex justify-center p-4 items-center"
  on:submit={handleSubmit}
>
  <section class="flex flex-col gap-y-8 w-1/2 mt-[5%]">
    <input
      type="text"
      name="companyname"
      required
      placeholder="companyname"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="text"
      name="country"
      required
      placeholder="country"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="text"
      name="city"
      placeholder="city"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="text"
      name="address"
      placeholder="address"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="file"
      name="logo"
      required
      accept=".jpg, .jpeg, .png, .webp"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="number"
      name="postalcode"
      placeholder="postalcode"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="text"
      name="phone"
      placeholder="phone"
      class="p-2 placeholder:text-lg"
    />
    <input
      type="text"
      name="email"
      placeholder="email"
      class="p-2 placeholder:text-lg"
    />
    <select name="producttype" id="producttype" class="p-2 w-max" required>
      <option value="SMARTPHONE" selected>Смартфон</option>
      <option value="TABLET">Планшет</option>
      <option value="CELLPHONE">Сотовый телефон</option>
      <option value="CABLE">Кабель</option>
      <option value="CHARGER">Зарядное устройство</option>
      <option value="WATCH">Часы</option>
      <option value="PLAYER">Плеер</option>
      <option value="HEADPHONE">Наушники</option>
    </select>
    <button type="submit" class="bg-blue-600 py-4 px-8 w-max text-white"
      >Добавить</button
    >
  </section>
</form>

<!-- model suppliers {
  companyname String       @db.VarChar(255)
  country     String       @db.VarChar(100)
  city        String?      @db.VarChar(100)
  address     String?      @db.VarChar(255)
  logo        String?
  postalcode  Int?
  phone       String?      @db.VarChar(20)
  email       String?      @db.VarChar(255)
  producttype devicetype[]
} -->
