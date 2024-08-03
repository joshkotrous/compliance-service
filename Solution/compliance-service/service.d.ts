// Type for applyComplianceRules Parameters
export function applyComplianceRules(
  states: string[],
  productInfo: ProductInfo
): MappedProduct | null;

// Type for after product is mapped
export interface MappedProduct {
  productId?: string;
  states: ValidatedState[];
}

// Type for a single validated state within a mapped product
export interface ValidatedState {
  state: string;
  isCompliant?: boolean;
  requiredProductInfo?: { [key: string]: any };
  message?: string;
}

// Type for the input product info
export interface ProductInfo {
  productId?: string;
  thcContent?: string;
  cbdContent?: string;
  netWeight?: string;
  batchNumber?: string;
  [key: string]: any;
}

// Type for the state configuration file input
export interface StateConfig {
  state_code: string;
  config: {
    fieldMapping?: object;
    stateSpecificFields?: object;
    requiredProductInfo?: string[];
  };
}
