export async function getModels(params) {
  let url = 'https://json-server-vercel-3d-react.vercel.app/models';
  if (params) {
    url += `/${params}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
