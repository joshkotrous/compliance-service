// Import the compliance service module
import { applyComplianceRules, ProductInfo } from "compliance-service";
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

// Define states to map the data to
const states = ["NY", "CA", "NV", "NE"];

// Log the product info that will be mapped
console.log("Applying compliance rules to: \n", productInfo, "\n");

// Invoke module to map the data
const mappedData = applyComplianceRules(states, productInfo);

// Log the mapped data
console.log(JSON.stringify(mappedData, null, 2));
