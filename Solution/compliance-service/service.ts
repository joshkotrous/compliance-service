import fs from "fs";
import path from "path";
import {
  MappedProduct,
  ValidatedState,
  ProductInfo,
  StateConfig,
} from "./service.d";

// Function to read state configuration file input from JSON
function getStateConfig(filePath: string): StateConfig | null {
  // Resolve the path to the app root calling the module to access the state configuration data store temporarily stored in the project folder
  const projectRoot = process.cwd();
  const absolutePath = path.resolve(projectRoot, filePath);

  try {
    // TODO: Replace with external state configuration data store
    const data = fs.readFileSync(absolutePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    return null;
  }
}

// Function to apply the compliance rules to a given product for the provided states
export function applyComplianceRules(
  states: string[],
  productInfo: ProductInfo
): MappedProduct | null {
  // Intialize a new mapped product
  const mappedProduct: MappedProduct = {
    productId: productInfo.productId,
    states: [],
  };

  // For each state, get and apply the compliance rules
  for (const state of states) {
    // Initialize mapped state data
    const stateData: ValidatedState = {
      state: state,
      isCompliant: true,
      requiredProductInfo: {},
    };

    // Get the state configuration
    const stateConfig = getStateConfig(`./state_configuration/${state}.json`);

    // If the state configuration is not found, continue to the next state
    if (!stateConfig) {
      mappedProduct.states.push({
        state: state,
        message: "Not supported.",
      });
      continue;
    }

    // Destructure supported items from the state configuration
    // TODO: Any new configurations we want to support can be destructured here
    const { requiredProductInfo, stateSpecificFields, fieldMapping } =
      stateConfig.config;

    // If required product info is in the config
    if (requiredProductInfo) {
      // For each field in the required product info, check if it is present. If it is present, apply any state specific formatting rules.
      for (const field of requiredProductInfo) {
        // If a required field is not found in the product info, set isCompliant to false and mark the field as noncompliant
        if (
          !(productInfo as any)[field] ||
          (productInfo as any)[field] === ""
        ) {
          stateData.isCompliant = false;
          stateData.requiredProductInfo![field] = "NONCOMPLIANT";
        } else {
          // if a required field is found, include the existing value
          stateData.requiredProductInfo![field] = (productInfo as any)[field];
        }
      }

      // Add any reamaining non-required fields to the output
      for (const [key, value] of Object.entries(productInfo)) {
        if (!stateData.requiredProductInfo!.hasOwnProperty(key)) {
          stateData.requiredProductInfo![key] = value;
        }
      }
    }

    // If state specific fields are in the config
    if (stateSpecificFields) {
      // Add additional state specific fields such as warning labels
      for (const [key, value] of Object.entries(stateSpecificFields)) {
        stateData.requiredProductInfo![key] = value;
      }
    }

    // If field mapping is in the config
    if (fieldMapping) {
      // Loop through each entry in the field mapping
      for (const [key, value] of Object.entries(fieldMapping)) {
        // If the required product info has a field that requires mapping
        if (stateData.requiredProductInfo!.hasOwnProperty(key)) {
          // Add a new entry with the mapped key and value
          stateData.requiredProductInfo![value] =
            stateData.requiredProductInfo![key];

          // Delete the old entry
          delete stateData.requiredProductInfo![key];
        }
      }
    }

    // TODO: Any new configurations that have been destructured can be implemented below.

    // Push the state data to the stateData array
    mappedProduct.states.push(stateData);
  }

  // Return the mapped product
  return mappedProduct;
}
