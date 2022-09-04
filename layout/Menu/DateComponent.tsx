import { useEffect, useState } from "react";

function DateAndTime() {
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  useEffect(() => {
    let timeId = setInterval(() => {
      const _date = new Date();
      setTime(_date.toLocaleTimeString());
      setDate(_date.toLocaleDateString());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <div className="py-8">
      <section className="h-6 text-xl font-bold mb-2">{date}</section>
      <span className="text-gray-400">{time}</span>
    </div>
  );
}

export default DateAndTime;
