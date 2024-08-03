import { applyComplianceRules } from "../service";
import { ProductInfo } from "../service.d";

describe("Test apply compliance rules", () => {
  // Define product info to map
  const productInfo: ProductInfo = {
    productId: "4e7a3c97-8dcd-4d8d-a9f8-72d52f5e5a2a",
    productName: "Skywalker OG",
    strain: "sativa",
    netWeight: "3.5g",
    thcContent: "28.4%",
    cbdContent: "19.4%",
    batchNumber: "23421",
    manufacturer: "Raw Garden",
    manufacturingDate: "06-24-2024",
  };

  test("Apply generic compliance rules", () => {
    // Define states to map the data to
    const states = ["NY", "CA", "NV", "NE"];

    // Invoke module to map the data
    const mappedData = applyComplianceRules(states, productInfo);

    // Check states property exists
    expect(mappedData).toHaveProperty("states");

    // Check that all product info is in the mapped data
    for (const state of mappedData?.states!) {
      if (!state.message) {
        expect(state).toHaveProperty("requiredProductInfo");
        for (const [key] of Object.entries(productInfo)) {
          expect(state.requiredProductInfo).toHaveProperty(key);
        }
      }
    }
  });

  test("Apply rules to unsupported state", () => {
    // Define states to map the data to
    const states = ["NE"];

    // Invoke module to map the data
    const mappedData = applyComplianceRules(states, productInfo);

    // Check to make sure not supported was output for the given state
    expect(mappedData).toHaveProperty("states");
    expect(mappedData?.states[0]).toHaveProperty("message");
    expect(mappedData?.states[0].message).toBe("Not supported.");
  });
});
