import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, renderToFile } from "@react-pdf/renderer";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: "Helvetica", color: "#0F172A", backgroundColor: "#FFFFFF" },

  // Header Block
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, pb: 12, borderBottomWidth: 1.5, borderBottomColor: "#E8621A" },
  logo: { width: 130, height: 42, objectFit: "contain" },
  companyInfo: { alignItems: "flex-end", textTransform: "none" },
  companyName: { fontSize: 11, fontWeight: "bold", color: "#E8621A", marginBottom: 2 },
  companyText: { fontSize: 7.5, color: "#475569", marginBottom: 1 },

  // Top Bar Meta
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF7ED", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginBottom: 14, borderWidth: 1, borderColor: "#FFEDD5" },
  reportTitle: { fontSize: 12, fontWeight: "bold", color: "#C2410C", textTransform: "uppercase", letterSpacing: 0.5 },
  reportDate: { fontSize: 8.5, fontWeight: "bold", color: "#9A3412" },

  // Columns / Grid Layout
  twoColGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: { flex: 1, padding: 10, backgroundColor: "#F8FAFC", borderRadius: 6, borderWidth: 1, borderColor: "#E2E8F0" },
  cardTitle: { fontSize: 7.5, fontWeight: "bold", color: "#E8621A", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 },
  cardTextMain: { fontSize: 10, fontWeight: "bold", color: "#0F172A", marginBottom: 2 },
  cardTextSub: { fontSize: 8, color: "#475569", marginBottom: 1 },

  // Full width Sections
  section: { marginBottom: 10, padding: 10, backgroundColor: "#FFFFFF", borderRadius: 6, borderWidth: 1, borderColor: "#E2E8F0" },
  sectionHeader: { fontSize: 8, fontWeight: "bold", color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingBottom: 3 },
  row: { flexDirection: "row", marginBottom: 4, alignItems: "center" },
  label: { width: "35%", fontSize: 8.5, color: "#64748B" },
  value: { width: "65%", fontSize: 8.5, fontWeight: "bold", color: "#0F172A" },

  // Photos Section
  photosSection: { marginTop: 8, padding: 10, backgroundColor: "#F8FAFC", borderRadius: 6, borderWidth: 1, borderColor: "#E2E8F0" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  photoItem: { width: "31%", height: 110, borderRadius: 4, objectFit: "cover", borderWidth: 1, borderColor: "#CBD5E1" },
  noPhotosText: { fontSize: 8, color: "#94A3B8", italic: true },

  // Footer
  footer: { position: "absolute", bottom: 20, left: 28, right: 28, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 8 },
  footerText: { fontSize: 7, color: "#94A3B8" },
});

export interface PDFData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  dateStr: string;
  existingBathroom: Record<string, string>;
  wetArea: Record<string, any>;
  tiledWetArea?: Record<string, any>;
  dryArea: Record<string, any>;
  tiledDryArea?: Record<string, any>;
  upgrades: Record<string, any>;
  notes?: string;
  photos: string[];
}

export function AssessmentPDFDocument({ data, logoBase64 }: { data: PDFData; logoBase64?: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo & Company Contact */}
        <View style={styles.headerContainer}>
          <View>
            {logoBase64 ? (
              <Image src={logoBase64} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E8621A" }}>GOOD BATHROOM RENOS</Text>
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Good Bathroom Renos</Text>
            <Text style={styles.companyText}>www.goodbathroomrenos.ca</Text>
            <Text style={styles.companyText}>Phone: +1 250-893-6066</Text>
            <Text style={styles.companyText}>Email: info@goodbathroomrenos.ca</Text>
            <Text style={styles.companyText}>950 Rockland Ave #206, Victoria, BC V8V 3H4</Text>
          </View>
        </View>

        {/* Title Bar */}
        <View style={styles.metaRow}>
          <Text style={styles.reportTitle}>Assessment Report</Text>
          <Text style={styles.reportDate}>Date: {data.dateStr}</Text>
        </View>

        {/* Client & Salesperson Info Grid */}
        <View style={styles.twoColGrid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Client Details</Text>
            <Text style={styles.cardTextMain}>{data.customerName}</Text>
            <Text style={styles.cardTextSub}>Phone: {data.customerPhone}</Text>
            {data.customerEmail && <Text style={styles.cardTextSub}>Email: {data.customerEmail}</Text>}
            <Text style={styles.cardTextSub}>Address: {data.customerAddress}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Assessed By (Salesperson)</Text>
            <Text style={styles.cardTextMain}>{data.sellerName}</Text>
            <Text style={styles.cardTextSub}>Email: {data.sellerEmail}</Text>
            {data.sellerPhone && <Text style={styles.cardTextSub}>Phone: {data.sellerPhone}</Text>}
          </View>
        </View>

        {/* Existing Bathroom Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Existing Bathroom Specifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Measurements / Sizes:</Text>
            <Text style={styles.value}>
              {data.existingBathroom.measurements || "N/A"} (Bath: {data.existingBathroom.bathSize || "-"} · Shower: {data.existingBathroom.showerSize || "-"})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wall Material:</Text>
            <Text style={styles.value}>{data.existingBathroom.wallMaterial || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Flooring:</Text>
            <Text style={styles.value}>
              {data.existingBathroom.flooringSquareFt ? `${data.existingBathroom.flooringSquareFt} sq ft` : ""} {data.existingBathroom.flooringMaterial ? `(${data.existingBathroom.flooringMaterial})` : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vanity Size:</Text>
            <Text style={styles.value}>{data.existingBathroom.vanitySize || "N/A"}</Text>
          </View>
        </View>

        {/* Wet Area Package */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Wet Area Package (Acrylic)</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Bath Package:</Text>
            <Text style={styles.value}>
              {data.wetArea.includeBath ? `Included - ${data.wetArea.bathDetails || "Standard"}` : "No"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shower Package:</Text>
            <Text style={styles.value}>
              {data.wetArea.includeShower ? `Included - ${data.wetArea.showerDetails || "Standard"}` : "No"}
            </Text>
          </View>
          {data.upgrades.includeGlassDoor !== false && (
            <View style={styles.row}>
              <Text style={styles.label}>Glass Door:</Text>
              <Text style={styles.value}>{data.upgrades.glassDoor || "N/A"}</Text>
            </View>
          )}
          {data.wetArea.includeAcrylicTilePanel !== false && (
            <View style={styles.row}>
              <Text style={styles.label}>Acrylic Tile Panel System:</Text>
              <Text style={styles.value}>{data.wetArea.acrylicTilePanel || "N/A"}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Package Upgrades:</Text>
            <Text style={styles.value}>
              {Array.isArray(data.dryArea.packageUpgrades) && data.dryArea.packageUpgrades.length > 0
                ? data.dryArea.packageUpgrades.join(", ")
                : typeof data.dryArea.packageUpgrades === "string" && data.dryArea.packageUpgrades
                  ? data.dryArea.packageUpgrades
                  : "None"}
            </Text>
          </View>
        </View>

        {/* Tiled Wet Area Section */}
        {data.tiledWetArea && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tiled Wet Area</Text>
            {data.tiledWetArea.includeBathOrShower !== false && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Bath or Shower:</Text>
                  <Text style={styles.value}>{data.tiledWetArea.bathOrShower || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Wet Area Size:</Text>
                  <Text style={styles.value}>{data.tiledWetArea.wetAreaSize || "N/A"}</Text>
                </View>
              </>
            )}
            {data.tiledWetArea.includeUpgrades !== false && (
              <View style={styles.row}>
                <Text style={styles.label}>Upgrades:</Text>
                <Text style={styles.value}>
                  {Array.isArray(data.tiledWetArea.upgrades) && data.tiledWetArea.upgrades.length > 0
                    ? data.tiledWetArea.upgrades.join(", ")
                    : "None"}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{data.tiledWetArea.notes || "N/A"}</Text>
            </View>
          </View>
        )}

        {/* Dry Area Package */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dry Area Package (Acrylic)</Text>
          {data.dryArea.includePackage !== false && (
            <View style={styles.row}>
              <Text style={styles.label}>Package Selection:</Text>
              <Text style={styles.value}>{data.dryArea.package || "N/A"}</Text>
            </View>
          )}
          {data.dryArea.includeVanity !== false && (
            <View style={styles.row}>
              <Text style={styles.label}>Vanity Style & Details:</Text>
              <Text style={styles.value}>
                {data.dryArea.vanityStyle || "N/A"} {data.dryArea.vanityDetails ? `(${data.dryArea.vanityDetails})` : ""}
              </Text>
            </View>
          )}
          {data.dryArea.includeMirrorLighting !== false && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Mirror / Lighting:</Text>
                <Text style={styles.value}>
                  Mirror: {data.dryArea.mirror || "N/A"} · Vanity Light: {data.dryArea.vanityLighting || "N/A"} · Upgrade Light: {data.dryArea.upgradeLighting || "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Towel Bars:</Text>
                <Text style={styles.value}>{data.dryArea.towelBars || "N/A"}</Text>
              </View>
            </>
          )}
        </View>

        {/* Tiled Dry Area Section */}
        {data.tiledDryArea && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tiled Dry Area</Text>
            {data.tiledDryArea.includeFlooring !== false && (
              <View style={styles.row}>
                <Text style={styles.label}>Flooring Selection:</Text>
                <Text style={styles.value}>
                  {data.tiledDryArea.flooringSelection || "N/A"} {data.tiledDryArea.flooringNotes ? `(${data.tiledDryArea.flooringNotes})` : ""}
                </Text>
              </View>
            )}
            {data.tiledDryArea.includeToilet !== false && (
              <View style={styles.row}>
                <Text style={styles.label}>Toilet Selection:</Text>
                <Text style={styles.value}>{data.tiledDryArea.toiletSelection || "N/A"}</Text>
              </View>
            )}
            {data.tiledDryArea.includeVanity !== false && (
              <View style={styles.row}>
                <Text style={styles.label}>Vanity Selection:</Text>
                <Text style={styles.value}>
                  {data.tiledDryArea.vanityStyle === "None"
                    ? "None"
                    : `Style: ${data.tiledDryArea.vanityStyle || "N/A"}${data.tiledDryArea.vanitySize ? ` · Size: ${data.tiledDryArea.vanitySize}` : ""}`}
                </Text>
              </View>
            )}
            {data.tiledDryArea.includeMirrorLighting !== false && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Mirror Choice:</Text>
                  <Text style={styles.value}>{data.tiledDryArea.mirrorChoice || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Lighting Choice:</Text>
                  <Text style={styles.value}>{data.tiledDryArea.lightingChoice || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Towel Bar Finish:</Text>
                  <Text style={styles.value}>{data.tiledDryArea.towelBarFinish || "N/A"}</Text>
                </View>
              </>
            )}
            {data.tiledDryArea.includeUpgrades !== false && (
              <View style={styles.row}>
                <Text style={styles.label}>Upgrades:</Text>
                <Text style={styles.value}>
                  {Array.isArray(data.tiledDryArea.upgrades) && data.tiledDryArea.upgrades.length > 0
                    ? data.tiledDryArea.upgrades.join(", ")
                    : "None"}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{data.tiledDryArea.notes || "N/A"}</Text>
            </View>
          </View>
        )}

        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Notes & Observations</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        )}

        {/* Attached Photos Gallery */}
        <View style={styles.photosSection} break={data.photos && data.photos.length > 2}>
          <Text style={styles.sectionHeader}>Attached Assessment Photos ({data.photos?.length || 0})</Text>
          {data.photos && data.photos.length > 0 ? (
            <View style={photoGridStyle(data.photos)}>
              {data.photos.map((photoUrl, idx) => {
                const relativePath = photoUrl.startsWith("/") ? photoUrl.slice(1) : photoUrl;
                const localPhotoPath = path.join(process.cwd(), "public", relativePath);

                if (fs.existsSync(localPhotoPath)) {
                  try {
                    const fileBuffer = fs.readFileSync(localPhotoPath);
                    const ext = path.extname(localPhotoPath).toLowerCase();
                    const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
                    const base64Data = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
                    return <Image key={idx} src={base64Data} style={styles.photoItem} />;
                  } catch (e) {
                    console.error("Error reading image for PDF:", localPhotoPath, e);
                  }
                }
                return null;
              })}
            </View>
          ) : (
            <Text style={styles.noPhotosText}>No photos attached to this assessment.</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Good Bathroom Renos · Assessment Report</Text>
          <Text style={styles.footerText}>www.goodbathroomrenos.ca · info@goodbathroomrenos.ca</Text>
        </View>
      </Page>
    </Document>
  );
}

function photoGridStyle(photos: string[]) {
  return styles.photoGrid;
}

export async function generateAssessmentPDFBuffer(data: PDFData, assessmentId: string): Promise<Buffer> {
  let logoBase64: string | undefined = undefined;

  // Try PNG logo first, fallback to avif or logo-192
  const candidateLogos = [
    path.join(process.cwd(), "public", "good-bathroom-renos-logo-1.png"),
  ];

  for (const logoPath of candidateLogos) {
    if (fs.existsSync(logoPath)) {
      try {
        const logoBuffer = fs.readFileSync(logoPath);
        const ext = path.extname(logoPath).toLowerCase();
        const mime = ext === ".avif" ? "image/avif" : ext === ".png" ? "image/png" : "image/jpeg";
        logoBase64 = `data:${mime};base64,${logoBuffer.toString("base64")}`;
        break;
      } catch (e) {
        console.error("Failed to read logo:", logoPath, e);
      }
    }
  }

  // Import renderToBuffer dynamically or directly
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const buffer = await renderToBuffer(<AssessmentPDFDocument data={data} logoBase64={logoBase64} />);
  return Buffer.from(buffer);
}
