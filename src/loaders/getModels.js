export async function getModels(params) {
  // let url = 'http://localhost:3002/models';
  let url = 'https://three-react.free.beeceptor.com/models';

  if (params) {
    // console.log('params', params);
    url += `/${params}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data);
  return data;
}
