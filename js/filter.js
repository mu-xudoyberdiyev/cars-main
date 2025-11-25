export function filterData(array, type) {
  const result = [];
  array.forEach((element) => {
    result.push(element[type]);
  });

  return Array.from(new Set(result));
}
