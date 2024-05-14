<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { debounce } from '$lib/utils/helpers.js';
  export let data;

  let currentUserLevel: number;

  let users: Writable<any> = writable([]);

  let searchValue: string = '';

  let privilegeChanges: Record<string, string>[] = [];

  let url = $page.url.searchParams;
  let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
  let totalPages = writable(1);

  let defaultPrivileges: Record<string, string> = {};

  const privilegesAsNumber = (p: string) => {
    switch (p) {
      case 'admin':
        return 2;
      case 'mod':
        return 1;
      default:
        return 0;
    }
  };

  const _fetchUserData = async (getTotal = false) => {
    if (getTotal) {
      const response = await fetch(
        `/v1/user?q=all&page=${$pageN}&search=${searchValue}&total=${getTotal}`
      );

      const count = await response.json();
      totalPages.set(count);
    }
    const response = await fetch(
      `/v1/user?q=all&page=${$pageN}&search=${searchValue}`
    );
    const res = await response.json();
    users.set(res);
    res.forEach((el: Record<string, string>) => {
      defaultPrivileges[el.userid] = el.privileges;
    });
  };

  const debouncedFetchData = debounce(_fetchUserData, 400);

  onMount(async () => {
    await _fetchUserData();
    switch (data.privileges) {
      case 'admin':
        currentUserLevel = 2;
        break;
      case 'mod':
        currentUserLevel = 1;
        break;
      default:
        currentUserLevel = 0;
    }
  });

  $: {
    searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
  }

  $: {
    totalPages.set(data.totalPages);
  }

  const handlePrivilegeChange = (event: any, userid: string) => {
    const selectedPrivilege = event.target.value;
    const defaultPrivilege = defaultPrivileges[userid];

    if (selectedPrivilege !== defaultPrivilege) {
      privilegeChanges.push({ userid, newPrivilege: selectedPrivilege });
      privilegeChanges = privilegeChanges;
    } else {
      privilegeChanges = privilegeChanges.filter(
        (change) => change.userid !== userid
      );
      privilegeChanges = privilegeChanges;
    }
  };

  const deleteUser = async (userid: string) => {
    const response = await fetch(`/v1/user?q=${userid}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.href = '/admin/users';
    }
  };

  const changePrivileges = async () => {
    if (!privilegeChanges || privilegeChanges.length === 0) return;
    privilegeChanges.forEach(async (el) => {
      const response = await fetch(
        `/v1/user?userid=${el.userid}&privilege=${el.newPrivilege}`,
        {
          method: 'PUT',
        }
      );
      if (response.ok) {
        window.location.href = '/admin/users';
      }
    });
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
      if (searchValue.length) debouncedFetchData(true);
    }}
  />
</section>
<section class="flex w-full justify-evenly overflow-x-scroll">
  <table class="w-max border-collapse mt-10 bg-white border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        <th class="py-2 px-4 text-left">Логин</th>
        <th class="py-2 px-4 text-left">Имя</th>
        <th class="py-2 px-4 text-left">Фамилия</th>
        <th class="py-2 px-4 text-left">Почта</th>
        <th class="py-2 px-4 text-left">Роль</th>
        <th class="py-2 px-4 text-left">Дата создания</th>
        <th class="py-2 px-4 text-left">Действие</th>
      </tr>
    </thead>
    <tbody>
      {#if $users && currentUserLevel}
        {#each $users as user}
          <tr class="hover:bg-gray-200">
            <td class="py-2 px-4 text-left"><span>{user.username}</span></td>
            <td class="py-2 px-4 text-left"><span>{user.firstname}</span></td>
            <td class="py-2 px-4 text-left"><span>{user.lastname}</span></td>
            <td class="py-2 px-4 text-left"><span>{user.email}</span></td>
            <td class="py-2 px-4 text-left">
              <select
                name="privileges"
                id="privileges_{user.userid}"
                bind:value={user.privileges}
                disabled={currentUserLevel != 2 &&
                  currentUserLevel < privilegesAsNumber(user.privileges)}
                class={'w-24 p-2 ' +
                  (user.privileges !== defaultPrivileges[user.userid]
                    ? 'bg-red-600 text-white'
                    : '')}
                on:change={(e) => {
                  handlePrivilegeChange(e, user.userid);
                }}
              >
                <option value="default" selected={user.privileges === 'default'}
                  >default</option
                >
                <option value="mod" selected={user.privileges === 'mod'}
                  >mod</option
                >
                <option
                  value="admin"
                  selected={user.privileges === 'admin'}
                  disabled={currentUserLevel < 2}>admin</option
                >
              </select>
            </td>
            <td class="py-2 px-4 text-left"
              ><span>{user.datecreated.split('T')[0]}</span></td
            >
            {#if data.privileges === 'admin'}
              <td
                class={'py-2 px-4 text-left font-bold hover:cursor-pointer ' +
                  (user.userid === data.userid
                    ? 'pointer-events-none text-gray-500'
                    : 'text-red-600')}
                ><a on:click={() => deleteUser(user.userid)}>Удалить</a></td
              >
            {:else if data.privileges === 'mod'}
              <td class="py-2 px-4 text-left font-bold"
                ><span>Недоступно</span></td
              >
            {/if}
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
      _fetchUserData();
    }}>Назад</button
  >
  <button
    class="text-blue-600 text-lg font-semibold disabled:text-gray-600"
    disabled={$pageN === $totalPages}
    on:click={() => {
      $pageN++;
      _fetchUserData();
    }}>Вперед</button
  >
  <button
    class="bg-blue-600 py-4 px-8 text-white rounded-lg"
    on:click={changePrivileges}>Сохранить изменения</button
  >
</section>
