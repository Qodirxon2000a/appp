import { useState, useEffect } from "react";
import axios from "axios";
import "./money.css";

const Money = () => {
  const [workers, setWorkers] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [salary, setSalary] = useState(0);
  const [selectedObject, setSelectedObject] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  // API'dan ishchilar va obyektlarni yuklash
  useEffect(() => {
    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal")
      .then(res => setWorkers(res.data))
      .catch(err => console.error("Ishchilarni yuklashda xatolik", err));

    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Object")
      .then(res => setObjects(res.data))
      .catch(err => console.error("Obyektlarni yuklashda xatolik", err));

    fetchPaymentHistory();
  }, []);

  // Oyliklar tarixini API'dan yuklash
  const fetchPaymentHistory = () => {
    axios.get("https://67bdf7a6321b883e790eaabf.mockapi.io/oyliklar")
      .then(res => setPaymentHistory(res.data))
      .catch(err => console.error("Oyliklar tarixini yuklashda xatolik", err));
  };

  // Ishchini tanlash
  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  // Oylik berish funksiyasi
  const handlePaySalary = () => {
    if (!selectedWorker || salary <= 0 || !selectedObject) {
      alert("Iltimos, ishchini tanlang, oylik kiriting va obyektni tanlang.");
      return;
    }

    const newPayment = {
      workerName: selectedWorker.name,
      amount: salary,
      object: selectedObject,
      date: new Date().toLocaleDateString(),
    };

    axios.post("https://67bdf7a6321b883e790eaabf.mockapi.io/oyliklar", newPayment)
      .then(() => {
        alert(`✅ ${selectedWorker.name} ga ${selectedObject} obyektida ${salary} so‘m oylik berildi!`);
        fetchPaymentHistory(); // API'dan qaytadan yuklash
      })
      .catch(err => console.error("Oylikni saqlashda xatolik", err));

    // To‘lovdan keyin ma’lumotni tozalash
    setSelectedWorker(null);
    setSalary(0);
    setSelectedObject("");
  };

  return (
    <div className="money-container">
      <h1>Ishchilar uchun oylik berish</h1>

      {/* Ishchilar ro‘yxati */}
      <div className="worker-list">
        {workers.map(worker => (
          <div 
            key={worker.id} 
            className={`worker-item ${selectedWorker?.id === worker.id ? "selected" : ""}`}
            onClick={() => handleSelectWorker(worker)}
          >
            {worker.name}
          </div>
        ))}
      </div>

      {/* Ish haqi kiritish va obyekt tanlash */}
      {selectedWorker && (
        <div className="salary-box">
          <h2>{selectedWorker.name} ga oylik berish</h2>
          <input 
            type="number" 
            placeholder="Oylik miqdori" 
            value={salary} 
            onChange={(e) => setSalary(Number(e.target.value))}
          />

          {/* Obyekt tanlash */}
          <select value={selectedObject} onChange={(e) => setSelectedObject(e.target.value)}>
            <option value="">Obyektni tanlang</option>
            {objects.map(obj => (
              <option key={obj.id} value={obj.name}>{obj.name}</option>
            ))}
          </select>

          <button onClick={handlePaySalary}>To‘lovni amalga oshirish</button>
        </div>
      )}

      {/* Oylik tarixi */}
      <h2>Oylik tarixi</h2>
      <table className="salary-history">
        <thead>
          <tr>
            <th>Ishchi</th>
            <th>Obyekt</th>
            <th>Miqdor</th>
            <th>Sana</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map(payment => (
            <tr key={payment.id}>
              <td>{payment.workerName}</td>
              <td>{payment.object}</td>
              <td>{payment.amount} so‘m</td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Money;
