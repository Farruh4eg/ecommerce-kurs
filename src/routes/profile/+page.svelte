<script lang="ts">
  import type { UserData } from '$lib/utils/interfaces.js';
  import { handleSubmit } from '$lib/utils/helpers.js';

  export let data;

  const userData: UserData = JSON.parse(data.userInsensitiveData);

  let notice: HTMLParagraphElement;

  let {
    userid,
    lastname,
    firstname,
    birthdate,
    country,
    city,
    postalcode,
    address,
  } = userData;

  const formSubmit = async () => {
    const response = await handleSubmit('/v1/user', 'put', {
      userid,
      lastname,
      firstname,
      country,
      city,
      postalcode,
      address,
    });

    if (response.ok) {
      notice.textContent = 'Данные успешно изменены';
    }
  };
</script>

<form
  class="flex flex-col w-[60rem] mx-auto my-4 rounded-lg bg-white p-4 border border-gray-300 gap-y-4"
  method="POST"
  on:submit|preventDefault={formSubmit}
>
  <h1
    class="w-full flex justify-center items-center font-bold text-3xl text-gray-600"
  >
    Личный кабинет
  </h1>

  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="lastname"
      bind:value={lastname}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="lastname" class="text-gray-600 text-sm">Фамилия</label>
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="firstname"
      bind:value={firstname}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="firstname" class="text-gray-600 text-sm">Имя</label>
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="date"
      name="birthdate"
      bind:value={birthdate}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="birthdate" class="text-gray-600 text-sm">Дата рождения</label>
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="country"
      bind:value={country}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="country" class="text-gray-600 text-sm">Страна</label>
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="city"
      bind:value={city}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="city" class="text-gray-600 text-sm"
      >Город / Населенный пункт</label
    >
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      inputmode="numeric"
      pattern="\d*"
      name="postalcode"
      bind:value={postalcode}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="postalcode" class="text-gray-600 text-sm">Почтовый индекс</label
    >
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="address"
      bind:value={address}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="address" class="text-gray-600 text-sm">Адрес</label>
  </section>
  <section class="h-max w-7/12 p-2 box-content text-center text-lg">
    <p bind:this={notice}></p>
  </section>
  <button
    class="ml-[50%] mt-4 px-4 py-2 bg-blue-500 w-max text-white hover:opacity-75 rounded-lg"
    >Сохранить</button
  >
</form>
