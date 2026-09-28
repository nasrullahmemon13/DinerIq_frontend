export function installAuthenticatedFetch() {
  const original = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof Request ? input.url : input, window.location.href);
    const localApi = url.origin === window.location.origin && url.pathname.startsWith('/api/');
    if (!localApi) return original(input, init);
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    const token = localStorage.getItem('dineiq_token');
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    headers.delete('X-User-Role');
    const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const target = apiOrigin ? `${apiOrigin}${url.pathname}${url.search}` : input;
    const request = apiOrigin && input instanceof Request ? new Request(target, input) : target;
    const response = await original(request, { ...init, headers });
    if (response.status === 401 && token && !url.pathname.endsWith('/auth/login')) {
      localStorage.removeItem('dineiq_token');
      localStorage.removeItem('dineiq_user');
      window.dispatchEvent(new Event('dineiq-session-expired'));
    }
    return response;
  };
}
