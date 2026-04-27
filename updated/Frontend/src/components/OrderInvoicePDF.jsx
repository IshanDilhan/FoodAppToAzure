import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

// Company information (customize these values)
const COMPANY_LOGO = "/logo.png";
const COMPANY_NAME = "Island Rasa Food Delivery";
const COMPANY_ADDRESS = "123 Food Street, Colombo, Sri Lanka";
const COMPANY_PHONE = "+94 112 345 678";
const COMPANY_EMAIL = "orders@islandrasa.lk";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#F59E0B",
    paddingBottom: 20
  },
  companyDetails: {
    flex: 2,
    paddingRight: 20
  },
  invoiceDetails: {
    flex: 1,
    alignItems: "flex-end"
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F59E0B",
    paddingBottom: 5
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  column: {
    width: "48%"
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
    paddingVertical: 8
  },
  cell: {
    padding: 6,
    flex: 1,
    textAlign: "left"
  },
  headerCell: {
    fontWeight: "bold",
    color: "#1F2937"
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFFBEB",
    borderRadius: 4
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 8
  }
});

export default function OrderInvoicePDF({ order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyDetails}>
            <Image src={COMPANY_LOGO} style={{ width: 120, marginBottom: 10 }} />
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{COMPANY_NAME}</Text>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>{COMPANY_ADDRESS}</Text>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>Tel: {COMPANY_PHONE}</Text>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>Email: {COMPANY_EMAIL}</Text>
          </View>
          
          <View style={styles.invoiceDetails}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1F2937", marginBottom: 5 }}>
              INVOICE
            </Text>
            <Text style={{ fontSize: 8 }}>
              Invoice #: {order._id.slice(-6).toUpperCase()}
            </Text>
            <Text style={{ fontSize: 8 }}>
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <Text style={{ fontSize: 8, marginTop: 10 }}>
              Due Date: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Customer and Delivery Details */}
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{order.address}</Text>
            <Text style={{ marginBottom: 2 }}>Phone: {order.phone}</Text>
            <Text>Delivery Type: {order.deliveryType}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <Text style={{ marginBottom: 2 }}>Method: {order.deliveryOption}</Text>
            {order.dropoffOption && <Text>Dropoff: {order.dropoffOption}</Text>}
            {order.instructions && <Text>Instructions: {order.instructions}</Text>}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Item</Text>
              <Text style={[styles.cell, styles.headerCell]}>Qty</Text>
              <Text style={[styles.cell, styles.headerCell]}>Unit Price</Text>
              <Text style={[styles.cell, styles.headerCell]}>Total</Text>
            </View>
            
            {order.items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <View style={[styles.cell, { flex: 2, flexDirection: "row", alignItems: "center" }]}>
                  {item.image && <Image src={item.image} style={{ width: 24, height: 24, marginRight: 8 }} />}
                  <Text>{item.name}</Text>
                </View>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>LKR {parseFloat(item.price).toLocaleString()}</Text>
                <Text style={styles.cell}>
                  LKR {(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>LKR {parseFloat(order.subtotal).toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery Fee:</Text>
            <Text>LKR {parseFloat(order.shippingFee).toLocaleString()}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 8 }]}>
            <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
            <Text style={{ fontWeight: "bold" }}>
              LKR {parseFloat(order.total).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Text>Payment Method: {order.paymentMethod}</Text>
          <Text>Payment Status: {order.paymentStatus}</Text>
          <Text style={{ marginTop: 8, fontStyle: "italic", color: "#6B7280" }}>
            Payment due upon receipt
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{COMPANY_NAME} | Thank you for your business!</Text>
          <Text>This is a computer-generated document and does not require a signature</Text>
        </View>
      </Page>
    </Document>
  );
}
