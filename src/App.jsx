import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home/home';
import Dash from "./components/dashboard/dash"
import Personal from "./components/dashboard/personal/personal"
import Object from './components/dashboard/Object/object';
import WorkType from "./components/dashboard/WorkType/WorkType"
import View from "./components/view/order/order"
import Calcu from "./components/calcu/calcu"
import Money from "./components/money/money"


const App = () => {
  useEffect(() => {
    // LocalStorage ma'lumotlarini 2 daqiqada bir marta o'chirish
    const interval = setInterval(() => {
      localStorage.clear();
      console.log("LocalStorage o'chirildi");
    }, 2 * 60 * 1000); // 2 daqiqa

    // Component unmount bo'lganda intervalni to'xtatish
    return () => clearInterval(interval);
  }, []);

  return (
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/Obyektlar" element={<Object />} />
        <Route path="/Ish" element={<WorkType />} />
        <Route path="/View" element={<View />} />
        <Route path="/Calcu" element={<Calcu />} />
        <Route path="/Money" element={<Money />} />

        
      </Routes>
  );
};

export default App;
