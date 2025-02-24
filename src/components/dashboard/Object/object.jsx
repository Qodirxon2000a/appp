import { useState, useEffect } from "react";
import axios from "axios";
import "./object.css"; // Styling shu faylda

const API_URL = "https://66a6197023b29e17a1a1ba9a.mockapi.io/Object";

const Object = () => {
  const [obyektlar, setObyektlar] = useState([]);
  const [newObyekt, setNewObyekt] = useState({ name: "", zona: "", mablag: "" });
  const [editingId, setEditingId] = useState(null);

  // Ma'lumotlarni olish
  useEffect(() => {
    fetchObyektlar();
  }, []);

  const fetchObyektlar = async () => {
    try {
      const response = await axios.get(API_URL);
      setObyektlar(response.data);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    }
  };

  // Inputlarni boshqarish
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewObyekt((prev) => ({ ...prev, [name]: value }));
  };

  // Obyekt qo‘shish yoki tahrirlash
  const handleSave = async () => {
    if (!newObyekt.name || !newObyekt.zona || !newObyekt.mablag) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newObyekt);
        setObyektlar(obyektlar.map((o) => (o.id === editingId ? { ...o, ...newObyekt } : o)));
        setEditingId(null);
      } else {
        const response = await axios.post(API_URL, newObyekt);
        setObyektlar([...obyektlar, response.data]);
      }
      setNewObyekt({ name: "", zona: "", mablag: "" });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  };

  // Obyektni o‘chirish
  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setObyektlar(obyektlar.filter((o) => o.id !== id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  // Tahrirlash rejimi
  const handleEdit = (obyekt) => {
    setNewObyekt({ name: obyekt.name, zona: obyekt.zona, mablag: obyekt.mablag });
    setEditingId(obyekt.id);
  };

  return (
    <div className="personal-container">
      <h1 className="personal-title">Obyektlar Boshqaruvi</h1>

      <div className="personal-form">
        <input type="text" name="name" placeholder="Obyekt nomi" value={newObyekt.name} onChange={handleChange} />
        <input type="text" name="zona" placeholder="Ish zonasi" value={newObyekt.zona} onChange={handleChange} />

        {/* Mablag‘ maydoni - foydalanuvchi o‘zi kiritadi yoki "Olinmagan"ni tanlaydi */}
        <input type="text" name="mablag" placeholder="Mablag‘ (UZS) yoki 'Olinmagan'" value={newObyekt.mablag} onChange={handleChange} />

        <button onClick={handleSave} className="add-btn">
          {editingId ? "💾 Saqlash" : "➕ Qo‘shish"}
        </button>
      </div>

      <table className="personal-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Obyekt nomi</th>
            <th>Ish zonasi</th>
            <th>Olingan mablag‘</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {obyektlar.map((obyekt, index) => (
            <tr key={obyekt.id}>
              <td>{index + 1}</td>
              <td>{obyekt.name}</td>
              <td>{obyekt.zona}</td>
              <td>{obyekt.mablag}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(obyekt)}>✏️ Tahrirlash</button>
                <br />
                <br />
                <button className="delete-btn" onClick={() => handleDelete(obyekt.id)}>🗑️ O‘chirish</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Object;
