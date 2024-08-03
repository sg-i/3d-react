export async function getNeighbors(recordId) {
  try {
    const response = await fetch('https://json-server-vercel-3d-react.vercel.app/models');
    const data = await response.json();

    const recordIndex = data.findIndex((model) => model.id == recordId);
    const totalRecords = data.length;
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
