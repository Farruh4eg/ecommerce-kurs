<script lang="ts">
  import { handleFetch } from '$lib/utils/helpers';
  let loginInput: string;
  let passwordInput: string;
  let confirmPasswordInput: string;
  let errorElement: HTMLParagraphElement;
  let registerForm: HTMLFormElement;
  let submitButton: HTMLButtonElement;

  const submitForm = async () => {
    if (passwordInput !== confirmPasswordInput) {
      errorElement.textContent = 'Пароли не совпадают';
    } else {
      submitButton.disabled = true;
      errorElement.textContent = '';
      const username = loginInput;
      const password = passwordInput;

      if (
        username.replaceAll(/['"`;%|]/g, '').trim().length < 4 ||
        password.replaceAll(/['"`;%|]/g, '').trim().length < 8
      ) {
        errorElement.textContent =
          'Некоррекные данные. Попробуйте снова через 5 секунд';
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }

      const response = await handleFetch('/v1/user', 'POST', {
        username,
        password,
      });

      if (response.ok) {
        errorElement.classList.add('text-green-500');
        errorElement.textContent =
          'Учетная запись создана успешно. Вы будете перенаправлены на страницу входа';
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (response.status == 409) {
        errorElement.textContent =
          'Пользователь уже существует. Если это вы, попробуйте войти.';
        submitButton.disabled = false;
      } else if (response.status == 400) {
        errorElement.textContent =
          'Имя пользователя должно быть от 4 символов. Пароль должен быть от 8 символов.';
        submitButton.disabled = false;
      }
    }
  };
</script>

<section
  class="w-[30rem] bg-white justify-center flex rounded-3xl h-[36rem] mx-auto mt-12 mb-12 shadow-lg box-content p-5"
>
  <form
    method="POST"
    class="w-full flex flex-col p-4 gap-y-8 h-full items-center justify-center"
    on:submit|preventDefault={submitForm}
    bind:this={registerForm}
  >
    <h1 class="h-max text-3xl text-gray-700 font-bold">Регистрация</h1>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="username"> Логин </label>
      <input
        type="text"
        name="username"
        class="w-7/12 box-content py-2 px-5 rounded-lg shadow-md border border-gray-300"
        bind:value={loginInput}
        minlength="4"
        required
      />
    </section>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="password"> Пароль </label>
      <input
        type="password"
        name="password"
        class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 pr-8"
        bind:value={passwordInput}
        minlength="8"
        required
      />
    </section>
    <section class="flex flex-col justify-center w-full gap-y-2 items-center">
      <label for="confirmPassword"> Подтвердите пароль </label>
      <input
        type="password"
        name="confirmPassword"
        class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 pr-8"
        bind:value={confirmPasswordInput}
        minlength="8"
        required
      />
    </section>
    <section
      class="h-max w-7/12 p-2 box-content text-center text-red-500 text-lg"
    >
      <p bind:this={errorElement} class="text-sm"></p>
    </section>
    <button
      bind:this={submitButton}
      type="submit"
      class="bg-white py-3 rounded-xl px-10 mt-12 hover:bg-blue-500 hover:text-white shadow-md border border-gray-200 disabled:bg-gray-300 disabled:text-white"
      >Регистрация</button
    >
  </form>
</section>
