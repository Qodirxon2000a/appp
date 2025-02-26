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
  const [groupedPayments, setGroupedPayments] = useState({});
  const [modalPayments, setModalPayments] = useState([]);
  const [earnedPayments, setEarnedPayments] = useState([]); // To'langan ma'lumotlar uchun yangi state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("oyliklar"); // Qaysi button faol ekanligini kuzatish

  useEffect(() => {
    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal")
      .then(res => setWorkers(res.data))
      .catch(err => console.error("Ishchilarni yuklashda xatolik", err));

    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Object")
      .then(res => setObjects(res.data))
      .catch(err => console.error("Obyektlarni yuklashda xatolik", err));

    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = () => {
    axios.get("https://67bdf7a6321b883e790eaabf.mockapi.io/oyliklar")
      .then(res => {
        setPaymentHistory(res.data);
        groupPayments(res.data);
      })
      .catch(err => console.error("Oyliklar tarixini yuklashda xatolik", err));
  };

  const fetchEarnedHistory = (workerName) => {
    axios.get("https://67bdf7a6321b883e790eaabf.mockapi.io/earned")
      .then(res => {
        const workerEarned = res.data.filter(payment => payment.workerName === workerName);
        setEarnedPayments(workerEarned);
      })
      .catch(err => console.error("Earned tarixini yuklashda xatolik", err));
  };

  const groupPayments = (payments) => {
    const grouped = payments.reduce((acc, payment) => {
      const key = payment.workerName;
      if (!acc[key]) {
        acc[key] = { workerName: payment.workerName, totalAmount: 0, records: [] };
      }
      acc[key].totalAmount += Number(payment.amount);
      acc[key].records.push(payment);
      return acc;
    }, {});
    setGroupedPayments(grouped);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handlePaySalary = () => {
    if (!selectedWorker || salary <= 0 || !selectedObject) {
      alert("Iltimos, ishchini tanlang, oylik kiriting va obyektni tanlang.");
      return;
    }

    const workerEarned = groupedPayments[selectedWorker.name]?.totalAmount || 0;
    if (workerEarned < salary) {
      alert("Ishchining ishlab topgan puli yetarli emas!");
      return;
    }

    const newPayment = {
      workerName: selectedWorker.name,
      amount: salary,
      object: selectedObject,
      date: new Date().toLocaleString(),
    };

    axios.post("https://67bdf7a6321b883e790eaabf.mockapi.io/earned", newPayment)
      .then(() => {
        const deductionPayment = {
          workerName: selectedWorker.name,
          amount: -salary,
          object: selectedObject,
          date: new Date().toLocaleString(),
        };

        axios.post("https://67bdf7a6321b883e790eaabf.mockapi.io/oyliklar", deductionPayment)
          .then(() => {
            alert(`✅ ${selectedWorker.name} ga ${selectedObject} obyektida ${salary} so‘m oylik berildi!`);
            fetchPaymentHistory();
            fetchEarnedHistory(selectedWorker.name); // To'langan ma'lumotlarni yangilash
            closeModal();
          })
          .catch(err => console.error("Oylikdan ayrib tashlashda xatolik", err));
      })
      .catch(err => console.error("Earned API ga saqlashda xatolik", err));

    setSalary(0);
    setSelectedObject("");
  };

  const openModal = (workerName) => {
    const worker = workers.find(w => w.name === workerName);
    setSelectedWorker(worker);
    setModalPayments(groupedPayments[workerName]?.records || []);
    fetchEarnedHistory(workerName); // To'langan ma'lumotlarni yuklash
    setActiveTab("oyliklar"); // Default holatda "Ishlagan kunlar" ko'rinadi
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
    setActiveTab("oyliklar");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="money-container">
      <h1>Ishchilar uchun oylik berish</h1>

      <div className="worker-list">
        {workers.map(worker => (
          <div 
            key={worker.id} 
            className="worker-item"
            onClick={() => openModal(worker.name)}
          >
            {worker.name} - Ishlagan: {groupedPayments[worker.name]?.totalAmount || 0} so‘m
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedWorker?.name} uchun ma'lumot</h2>
            <p>Ishlab topgan: {groupedPayments[selectedWorker?.name]?.totalAmount || 0} so‘m</p>
            <input 
              type="number" 
              placeholder="Oylik miqdori" 
              value={salary} 
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <select value={selectedObject} onChange={(e) => setSelectedObject(e.target.value)}>
              <option value="">Obyektni tanlang</option>
              {objects.map(obj => (
                <option key={obj.id} value={obj.name}>{obj.name}</option>
              ))}
            </select>
            <button onClick={handlePaySalary}>To‘lovni amalga oshirish</button>

            <h3>To‘lovlar tarixi</h3>
            <div className="tab-buttons">
              <button 
                onClick={() => handleTabChange("oyliklar")} 
                className={activeTab === "oyliklar" ? "active" : ""}
              >
                Ishlagan kunlar
              </button>
              <button 
                onClick={() => handleTabChange("earned")} 
                className={activeTab === "earned" ? "active" : ""}
              >
                To‘langan
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Obyekt</th>
                  <th>Miqdor</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "oyliklar" && modalPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.object}</td>
                    <td>{payment.amount} so‘m</td>
                    <td>{payment.date}</td>
                  </tr>
                ))}
                {activeTab === "earned" && earnedPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.object}</td>
                    <td>{payment.amount} so‘m</td>
                    <td>{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeModal}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Money;