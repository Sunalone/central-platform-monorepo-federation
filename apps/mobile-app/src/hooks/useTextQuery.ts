import { startTransition, useDeferredValue, useState } from 'react';

export const useTextQuery = () => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('zh-CN'));

  const submit = () => {
    startTransition(() => setQuery(input));
  };

  const reset = () => {
    setInput('');
    startTransition(() => setQuery(''));
  };

  return {
    input,
    query: deferredQuery,
    setInput,
    submit,
    reset,
  };
};
