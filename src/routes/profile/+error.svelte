<script lang="ts">
  import { page } from '$app/stores';
  let errorMessage: string;
  switch ($page.status) {
    case 500:
      errorMessage =
        'Пожалуйста, авторизируйтесь прежде чем войти в личный кабинет';
      break;
  }
</script>

<h1 class="text-red-500">{errorMessage}</h1>
