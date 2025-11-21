import { useState } from "react";

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState("");
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState([]);

  const uploadPDF = async () => {
    if (!pdfFile) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setText(data.text);
    alert("PDF uploaded. Pages: " + data.pages);
  };

  const checkDocument = async () => {
    const res = await fetch("http://localhost:3000/check-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, rules }),
    });

    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>NIYAMR Document Checker</h1>

      <h3>Upload PDF</h3>
      <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
      <button onClick={uploadPDF}>Upload & Parse</button>

      <div style={{ marginTop: "20px" }}>
        {rules.map((r, i) => (
          <div key={i}>
            Rule {i + 1}{" "}
            <input
              value={rules[i]}
              onChange={(e) => {
                const copy = [...rules];
                copy[i] = e.target.value;
                setRules(copy);
              }}
            />
          </div>
        ))}
      </div>

      <button style={{ marginTop: "20px" }} onClick={checkDocument}>
        Check Document
      </button>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Status</th>
            <th>Evidence</th>
            <th>Reasoning</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {/* {results.map((r, i) => (
            <tr key={i}>
              <td>{rules[i]}</td>
              <td>{r.status}</td>
              <td>{r.evidence}</td>
              <td>{r.reasoning}</td>
              <td>{r.confidence}</td>
            </tr>
          ))} */}
          {Array.isArray(results) && results.length > 0 && results.map((item, i) => (
  <tr key={i}>
    <td>{item.rule || "-"}</td>
    <td>{item.status || "-"}</td>
    <td>{item.evidence || "-"}</td>
    <td>{item.reasoning || "-"}</td>
    <td>{item.confidence || "-"}</td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  );
}