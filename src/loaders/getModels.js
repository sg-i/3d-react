export async function getModels(params) {
  let url = 'http://localhost:3001/models';

  if (params) {
    // console.log('params', params);
    url += `/${params}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data);
  return data;
}
