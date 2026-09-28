export async function downloadFile(path, fallbackName) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Download failed (${response.status}). Please check your session and permissions.`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] || fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
