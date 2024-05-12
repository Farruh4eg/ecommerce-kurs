import type { devicetype, frequencytype, memorytype } from '@prisma/client';

export const createErrorResponse = (
  message: string,
  status: number
): Response => {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const deviceEnumValueToString = (deviceEnum: devicetype): string => {
  let devType = null;

  switch (deviceEnum) {
    case 'SMARTPHONE':
      devType = 'Смартфон';
      break;
    case 'TABLET':
      devType = 'Планшет';
      break;
    case 'WATCH':
      devType = 'Часы';
      break;
    case 'HEADPHONE':
      devType = 'Наушники';
      break;
    case 'CABLE':
      devType = 'Кабель';
      break;
    case 'CHARGER':
      devType = 'Зарядное устройство';
      break;
    case 'PLAYER':
      devType = 'Проигрыватель';
      break;
    case 'CELLPHONE':
      devType = 'Сотовый телефон';
  }

  return devType;
};

export const memoryEnumValueToString = (memoryEnum: memorytype): string => {
  let memType = null;
  switch (memoryEnum) {
    case 'TB':
      memType = 'ТБ';
      break;
    case 'GB':
      memType = 'ГБ';
      break;
    case 'MB':
      memType = 'МБ';
      break;
    case 'KB':
      memType = 'КБ';
  }

  return memType;
};

export const frequencyEnumValueToString = (
  frequencyEnum: frequencytype
): string => {
  let frequencyType = null;

  switch (frequencyEnum) {
    case 'GHz':
      frequencyType = 'ГГц';
      break;
    case 'MHz':
      frequencyType = 'МГц';
      break;
    case 'KHz':
      frequencyType = 'КГц';
      break;
    case 'Hz':
      frequencyType = 'Гц';
  }

  return frequencyType;
};

export const addSpaceInString = (inputString: string): string => {
  if (inputString.length <= 3) {
    return inputString;
  }

  let result = '';
  let counter = 0;

  for (let i = inputString.length - 1; i >= 0; i--) {
    result = inputString[i] + result;
    counter++;
    if (counter === 3 && i !== 0) {
      result = ' ' + result;
      counter = 0;
    }
  }

  return result;
};

export const handleFetch = async (
  url: string,
  method: string,
  body: {},
  headers?: {}
) => {
  try {
    const response = await fetch(url, {
      method,
      credentials: 'same-origin',
      body: JSON.stringify(body),
      headers: {
        ...headers,
      },
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timerId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const fetchProducts = async (
  searchQuery: string,
  page: number,
  eventFetch: (
    input: string | URL | Request,
    init?: RequestInit | undefined
  ) => Promise<Response>
) => {
  const response = await eventFetch(
    `/v1/products?q=${searchQuery}&page=${page}`
  );
  return response.json();
};
