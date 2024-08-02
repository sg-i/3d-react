export async function getNeighbors(recordId) {
  try {
    console.log(recordId);
    // const response = await fetch('http://localhost:3002/models');
    const response = await fetch('https://three-react.free.beeceptor.com/models');
    const data = await response.json();
    console.log(data);

    const recordIndex = data.findIndex((model) => model.id == recordId);
    console.log(recordIndex);
    const totalRecords = data.length;
    console.log(totalRecords);
    if (recordIndex === -1) {
      return null; // Если запись с указанным id не найдена
    }

    const prevIndex = (recordIndex - 1 + totalRecords) % totalRecords;
    const nextIndex = (recordIndex + 1) % totalRecords;

    const prevNeighborId = {
      id: data[prevIndex].id,
      name: data[prevIndex].name,
    };
    const nextNeighborId = {
      id: data[nextIndex].id,
      name: data[nextIndex].name,
    };

    return { prev: prevNeighborId, next: nextNeighborId };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
