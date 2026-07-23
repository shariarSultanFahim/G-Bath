import React from "react";
import { Page, Text, View, Document, StyleSheet, renderToFile } from "@react-pdf/renderer";
import path from "path";
import { mkdir } from "fs/promises";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica", color: "#1A2B4A" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#E2E8F0", paddingBottom: 10 },
  brand: { fontSize: 18, fontWeight: "bold", color: "#E8621A" },
  subtitle: { fontSize: 8, color: "#64748B" },
  titleGroup: { alignItems: "flex-end" },
  reportTitle: { fontSize: 14, fontWeight: "bold", color: "#1A2B4A" },
  dateText: { fontSize: 8, color: "#64748B" },
  grid: { flexDirection: "row", gap: 15, marginBottom: 15 },
  card: { flex: 1, padding: 10, backgroundColor: "#F8FAFC", borderRadius: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  cardTitle: { fontSize: 8, fontWeight: "bold", color: "#94A3B8", marginBottom: 4, textTransform: "uppercase" },
  cardValue: { fontSize: 11, fontWeight: "bold", color: "#1A2B4A" },
  cardSub: { fontSize: 8, color: "#64748B" },
  section: { marginBottom: 12, padding: 10, backgroundColor: "#F8FAFC", borderRadius: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  sectionHeader: { fontSize: 8, fontWeight: "bold", color: "#94A3B8", marginBottom: 6, textTransform: "uppercase" },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: "35%", fontSize: 9, color: "#64748B" },
  value: { width: "65%", fontSize: 9, fontWeight: "bold", color: "#1A2B4A" },
});

export interface PDFData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  dateStr: string;
  existingBathroom: Record<string, string | undefined>;
  wetArea: Record<string, string | undefined>;
  dryArea: Record<string, string | undefined>;
  upgrades: Record<string, string | undefined>;
  notes?: string;
  photosCount: number;
}

export function AssessmentPDFDocument({ data }: { data: PDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>G BATH</Text>
            <Text style={styles.subtitle}>BATHROOM RENOVATION SPECIALISTS</Text>
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.reportTitle}>Assessment Report</Text>
            <Text style={styles.dateText}>{data.dateStr}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Client</Text>
            <Text style={styles.cardValue}>{data.customerName}</Text>
            <Text style={styles.cardSub}>{data.customerPhone}</Text>
            <Text style={styles.cardSub}>{data.customerAddress}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Measurements</Text>
            <Text style={styles.cardValue}>{data.existingBathroom.measurements || "N/A"}</Text>
            <Text style={styles.cardSub}>Bath: {data.existingBathroom.bathSize || "-"} · Shower: {data.existingBathroom.showerSize || "-"}</Text>
            <Text style={styles.cardSub}>Vanity: {data.existingBathroom.vanitySize || "-"} · Floor: {data.existingBathroom.flooringSquareFt || "-"} sq ft</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Wall & Flooring Material</Text>
          <Text style={styles.value}>Tile · Floor: {data.existingBathroom.flooringMaterial || "Tile"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Wet Area</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Bath:</Text>
            <Text style={styles.value}>{data.wetArea.includeBath ? `Yes - ${data.wetArea.bathDetails || "Standard"}` : "No"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shower:</Text>
            <Text style={styles.value}>{data.wetArea.includeShower ? `Yes - ${data.wetArea.showerDetails || "Standard"}` : "No"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Acrylic Panel System:</Text>
            <Text style={styles.value}>{data.wetArea.acrylicTilePanel || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dry Area</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Package / Flooring:</Text>
            <Text style={styles.value}>{data.dryArea.package || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vanity Style:</Text>
            <Text style={styles.value}>{data.dryArea.vanityStyle || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mirror / Lighting:</Text>
            <Text style={styles.value}>Mirror: {data.dryArea.mirror || "-"} · Lighting: {data.dryArea.vanityLighting || "-"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Upgrades & Glass Door</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Upgrades:</Text>
            <Text style={styles.value}>{data.dryArea.packageUpgrades || "None"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Glass Door:</Text>
            <Text style={styles.value}>{data.upgrades.glassDoor || "N/A"}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Notes</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        )}

        <Text style={{ fontSize: 8, color: "#94A3B8", marginTop: 10 }}>Photos attached: {data.photosCount}</Text>
      </Page>
    </Document>
  );
}

export async function generateAssessmentPDF(data: PDFData, assessmentId: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", "pdfs");
  await mkdir(dir, { recursive: true });

  const fileName = `Assessment_${data.customerName.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  await renderToFile(<AssessmentPDFDocument data={data} />, filePath);
  return `/uploads/pdfs/${fileName}`;
}
