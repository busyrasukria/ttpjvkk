import React, { useState } from "react";

// Gaya CSS ringkas (inline style) untuk borang
const styles = {
  form: {
    padding: "20px",
    border: "2px solid #e0e0e0",
    borderRadius: "16px",
    backgroundColor: "#f9f9f9",
    marginTop: "24px",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: "bold" as "bold",
    color: "#333",
    marginBottom: "16px",
  },
  inputGroup: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "4px",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box" as "border-box", // Perlu untuk pastikan padding tak rosakkan lebar
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  status: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "8px",
  },
  statusSuccess: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
};

export default function AddPartForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi ini akan dipanggil bila borang di-submit
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Halang page dari refresh
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Penting: Kita hantar guna FormData, BUKAN JSON, sebab ada fail
    try {
      const response = await fetch("/api/add_part.php", { // Hantar ke fail PHP kita
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Sesuatu berlaku");
      }

      setStatus({ type: "success", message: result.message });
      form.reset(); // Kosongkan borang bila berjaya
    } catch (error) {
      if (error instanceof Error) {
        setStatus({ type: "error", message: `Gagal: ${error.message}` });
      } else {
        setStatus({ type: "error", message: "Gagal: Ralat tidak diketahui" });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.formTitle}>Tambah Part Baru</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="partId">Part ID (Unik, cth: p7)</label>
          <input style={styles.input} type="text" name="partId" id="partId" required />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="partName">Nama Part</label>
          <input style={styles.input} type="text" name="partName" id="partName" required />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="partNo">Part No</label>
          <input style={styles.input} type="text" name="partNo" id="partNo" required />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="model">Model</label>
          <input style={styles.input} type="text" name="model" id="model" required />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="stdPacking">Std Packing</label>
          <input style={styles.input} type="number" name="stdPacking" id="stdPacking" defaultValue="1" required />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="imageFile">Gambar Part</label>
          <input style={styles.input} type="file" name="imageFile" id="imageFile" accept="image/*" required />
        </div>

        <button 
          type="submit" 
          style={styles.button} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menghantar..." : "Simpan Part Baru"}
        </button>
      </form>
      
      {/* Untuk tunjuk mesej berjaya atau gagal */}
      {status && (
        <div 
          style={{
            ...styles.status,
            ...(status.type === "success" ? styles.statusSuccess : styles.statusError),
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
