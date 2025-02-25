import { useState, useEffect } from "react";
import axios from "axios";
import "./calcu.css"; // Personal.jsx dagi stilni ishlatish

const Calcu = () => {
  const [orders, setOrders] = useState([]);
  const [ishchilar, setIshchilar] = useState([]);
  const [obyektlar, setObyektlar] = useState([]);
  const [ishTurlari, setIshTurlari] = useState([]);

  useEffect(() => {
    axios.get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Buyurtmalarni yuklashda xatolik", err));

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

  const getIshchiNomi = (id) => {
    const ishchi = ishchilar.find(i => i.id === id);
    return ishchi ? ishchi.name : "Noma'lum";
  };

  const getObyektNomi = (id) => {
    const obyekt = obyektlar.find(o => o.id === id);
    return obyekt ? obyekt.name : "Noma'lum";
  };

  const getIshTuriNomi = (id) => {
    const ishTuri = ishTurlari.find(t => t.id === id);
    return ishTuri ? `${ishTuri.name} - ${ishTuri.price} so'm` : "Noma'lum";
  };

  return (
    <div className="personal-container">
      <h1>Ro'yhat</h1>
      <table className="personal-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ishchilar</th>
            <th>Obyekt</th>
            <th>Ish turi</th>
            <th>Sana</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>
                <div className="column-data">
                  {order.ishchilar.map(id => (
                    <span key={id}>{getIshchiNomi(id)}</span>
                  ))}
                </div>
              </td>
              <td>{getObyektNomi(order.obyekt)}</td>
              <td>{getIshTuriNomi(order.ishTuri)}</td>
              <td>{order.sana}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calcu;
