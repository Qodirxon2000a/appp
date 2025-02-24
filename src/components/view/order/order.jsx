import { useState, useEffect } from "react";
import axios from "axios";
import "./order.css";

const Order = () => {
  const [ishchilar, setIshchilar] = useState([]);
  const [obyektlar, setObyektlar] = useState([]);
  const [ishTurlari, setIshTurlari] = useState([]);

  const [selectedIshchilar, setSelectedIshchilar] = useState([]);
  const [selectedObyekt, setSelectedObyekt] = useState("");
  const [selectedIshTuri, setSelectedIshTuri] = useState("");

  useEffect(() => {
    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal")
      .then(res => setIshchilar(res.data))
      .catch(err => console.error("Ishchilarni yuklashda xatolik", err));

    axios.get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Object")
      .then(res => setObyektlar(res.data))
      .catch(err => console.error("Obyektlarni yuklashda xatolik", err));

    axios.get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Worker")
      .then(res => setIshTurlari(res.data))
      .catch(err => console.error("Ish turlarini yuklashda xatolik", err));
  }, []);

  const handleIshchiChange = (id) => {
    setSelectedIshchilar(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const sendOrder = () => {
    if (!selectedIshchilar.length || !selectedObyekt || !selectedIshTuri) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const newOrder = {
      ishchilar: selectedIshchilar,
      obyekt: selectedObyekt,
      ishTuri: selectedIshTuri,
    };

    axios.post("https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu", newOrder)
      .then(() => alert("Buyurtma muvaffaqiyatli saqlandi!"))
      .catch(err => console.error("Buyurtmani yuborishda xatolik", err));
  };

  return (
    <div className="order-container">
      <h1>Buyurtma Yaratish</h1>

      <div className="order-section">
        <h3>Ishchilarni tanlang</h3>
        <br />
        {ishchilar.map(ishchi => (
          <label key={ishchi.id}>
            <input
              type="checkbox"
              value={ishchi.id}
              checked={selectedIshchilar.includes(ishchi.id)}
              onChange={() => handleIshchiChange(ishchi.id)}
            />
            {ishchi.name}
          </label>
          
        ))}
      </div>
      <div className="order-section">
        <h3>Obyektni tanlang</h3>
        <select value={selectedObyekt} onChange={(e) => setSelectedObyekt(e.target.value)}>
          <option value="">Obyektni tanlang</option>
          {obyektlar.map(obj => (
            <option key={obj.id} value={obj.id}>{obj.name}</option>
          ))}
        </select>
      </div>

      <div className="order-section">
        <h3>Ish turini tanlang</h3>
        <select value={selectedIshTuri} onChange={(e) => setSelectedIshTuri(e.target.value)}>
          <option value="">Ish turini tanlang</option>
          {ishTurlari.map(tur => (
            <option key={tur.id} value={tur.id}>{tur.name} - {tur.price} so'm</option>
          ))}
        </select>
      </div>

      <button onClick={sendOrder} className="order-btn">Buyurtmani Yuborish</button>
    </div>
  );
};

export default Order;
