export function convertQuantity(
  quantity: number,
  fromUnit: string,
  toUnit: string
): number {
  if (fromUnit === toUnit) return quantity;

  // Peso
  if (fromUnit === "kg" && toUnit === "g") return quantity * 1000;
  if (fromUnit === "g" && toUnit === "kg") return quantity / 1000;

  // Volume (se aplicável)
  if (fromUnit === "l" && toUnit === "ml") return quantity * 1000;
  if (fromUnit === "ml" && toUnit === "l") return quantity / 1000;

  throw new Error(`Conversão não suportada: ${fromUnit} → ${toUnit}`);
}
