export const getTransitBids = async (from, to) => {
  const response = await fetch(`http://localhost:3000/transitMock?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  return await response.json();
}