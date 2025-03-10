/**
 * Formats a license key with proper spacing for readability
 * @param licenseKey The raw license key
 * @returns Formatted license key with consistent spacing
 */
export function formatLicenseKey(licenseKey: string): string {
  // If the license key already has a format, maintain it
  if (licenseKey.includes('-')) {
    return licenseKey;
  }
  
  // Otherwise, add dashes every 4 characters
  const chunks = [];
  for (let i = 0; i < licenseKey.length; i += 4) {
    chunks.push(licenseKey.substr(i, 4));
  }
  return chunks.join('-');
}

/**
 * Determines if a license is about to expire (within 30 days)
 * @param expiresAt The expiration date string
 * @returns True if the license will expire within 30 days
 */
export function isAboutToExpire(expiresAt: string): boolean {
  const expirationDate = new Date(expiresAt);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return expirationDate <= thirtyDaysFromNow && expirationDate > new Date();
}

/**
 * Get the number of days until a license expires
 * @param expiresAt The expiration date string
 * @returns Number of days until expiration
 */
export function getDaysUntilExpiration(expiresAt: string): number {
  const expirationDate = new Date(expiresAt);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  expirationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const differenceInTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
}

/**
 * Generates activation instructions for a specific product
 * @param productName The name of the product
 * @returns Array of instructions for activating the license
 */
export function getActivationInstructions(productName: string): string[] {
  const commonInstructions = [
    "Download the software from your account or using the download link in your confirmation email.",
    "Install the software on your computer.",
    "When prompted, enter the license key exactly as shown above.",
    "Your software will validate the license key and activate your product."
  ];
  
  // Product-specific instructions could be added here based on product name
  
  return commonInstructions;
}

/**
 * Creates a license file content for download
 * @param license The license object
 * @returns Formatted license file content as a string
 */
export function createLicenseFileContent(license: {
  licenseKey: string;
  product: { name: string };
  licenseType: { name: string };
  expiresAt: string;
}): string {
  const activationInstructions = getActivationInstructions(license.product.name);
  
  return `License Key: ${license.licenseKey}
Product: ${license.product.name}
License Type: ${license.licenseType.name}
Expires: ${new Date(license.expiresAt).toLocaleDateString()}
    
Activation Instructions:
${activationInstructions.map((instr, idx) => `${idx + 1}. ${instr}`).join('\n')}`;
}

/**
 * Downloads a license file for the user
 * @param license The license object
 */
export function downloadLicenseFile(license: {
  licenseKey: string;
  product: { name: string };
  licenseType: { name: string };
  expiresAt: string;
}): void {
  const licenseText = createLicenseFileContent(license);
  const blob = new Blob([licenseText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${license.product.name.replace(/\s+/g, "_").toLowerCase()}_license.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
