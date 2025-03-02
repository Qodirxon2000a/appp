import React, { useEffect, useState } from "react";
import axios from "axios";
import "./money.css";

const Money = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState({});
  const [objectData, setObjectData] = useState({});
  const [priceData, setPriceData] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    axios
      .get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal")
      .then((response) => {
        const personalMap = response.data.reduce((acc, person) => {
          acc[person.id] = person.name;
          return acc;
        }, {});
        setPersonalData(personalMap);
      })
      .catch((error) => {
        console.error("Error fetching personal data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Object")
      .then((response) => {
        const objectMap = response.data.reduce((acc, obj) => {
          acc[obj.id] = { name: obj.name, date: obj.sana };
          return acc;
        }, {});
        setObjectData(objectMap);
      })
      .catch((error) => {
        console.error("Error fetching object data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Worker")
      .then((response) => {
        const priceMap = response.data.reduce((acc, worker) => {
          acc[worker.id] = worker.price;
          return acc;
        }, {});
        setPriceData(priceMap);
      })
      .catch((error) => {
        console.error("Error fetching price data:", error);
      });
  }, []);

  const handleWorkerClick = (workerId) => {
    setSelectedWorker(workerId);
  };

  return (
    <div className="money-container">
      <h1 className="money-title">Money Data</h1>
      <div className="worker-buttons">
        {Object.entries(personalData).map(([id, name]) => (
          <button key={id} className="worker-btn" onClick={() => handleWorkerClick(id)}>
            {name}
          </button>
        ))}
      </div>
      {selectedWorker && (
        <div className="modal">
          <div className="modal-content">
            <h2>{personalData[selectedWorker]}</h2>
            <table className="worker-table" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid black" }}>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Obyekt</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Narx</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Sana</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => item.ishchilar.includes(selectedWorker))
                  .map((item) => (
                    <tr key={item.id}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>{objectData[item.obyekt]?.name || "Noma'lum"}</td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>{priceData[item.ishTuri] || "Noma'lum"} so‘m</td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>{item.sana || "Noma'lum"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="total-salary">
              Jami ish haqi: {
                data
                  .filter((item) => item.ishchilar.includes(selectedWorker))
                  .reduce((sum, item) => sum + (parseInt(priceData[item.ishTuri]) || 0), 0)
              } so‘m
            </p>
            <button className="close-btn" onClick={() => setSelectedWorker(null)}>Yopish</button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="money-grid">
          {data.map((item) => (
            <div key={item.id} className="money-card">
              <p className="money-name">{objectData[item.obyekt]?.name || "Noma'lum"}</p>
              <p className="money-amount">
                {typeof item.amount === "object"
                  ? `Narx: ${item.amount.price || "Noma'lum"}`
                  : item.amount}
              </p>
              <p className="money-workers">
                Ishchilar: {Array.isArray(item.ishchilar)
                  ? item.ishchilar.map((id) => personalData[id] || "Noma'lum").join(", ")
                  : "Yo'q"}
              </p>
              <p className="money-price">Narx: {priceData[item.ishTuri] || "Noma'lum"}</p>
              <p className="money-date">Sana: {item.sana || "Noma'lum"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Money;