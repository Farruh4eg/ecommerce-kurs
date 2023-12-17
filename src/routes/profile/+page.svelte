<script lang="ts">
  interface UserData {
    userid: string;
    username: string;
    privileges: string;
    email: string;
    lastname: string;
    firstname: string;
    birthdate: Date;
    country: string;
    city: string;
    postalcode: number;
    address: string;
  }

  export let data;

  const userData: UserData = JSON.parse(data.userInsensitiveData);

  let {
    username,
    email,
    lastname,
    firstname,
    birthdate,
    country,
    city,
    postalcode,
    address,
  } = userData;
</script>

<section
  class="flex flex-col w-[60rem] mx-auto my-4 rounded-lg bg-white p-4 border border-gray-300 gap-y-4"
>
  <h1
    class="w-full flex justify-center items-center font-bold text-3xl text-gray-600"
  >
    Личный кабинет
  </h1>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="text"
      name="username"
      required
      bind:value={username}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="username" class="text-gray-600 text-sm">Никнейм</label>
  </section>
  <section class="flex w-full items-center gap-x-8">
    <input
      type="email"
      name="email"
      bind:value={email}
      class="border border-gray-300 py-3 px-2 w-64 rounded-lg font-bold text-sm text-gray-800"
    />
    <label for="email" class="text-gray-600 text-sm">Email</label>
  </section>
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
      type="number"
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
</section>
