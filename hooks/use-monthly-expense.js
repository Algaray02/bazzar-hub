import { useState, useEffect } from "react";

export const useMonthlyExpense = (userId) => {
  const [chartData, setChartData] = useState([
    { month: "Jul", expense: 0.5 },
    { month: "Agu", expense: 1.2 },
    { month: "Sep", expense: 0.8 },
    { month: "Okt", expense: 2.5 },
    { month: "Nov", expense: 1.5 },
    { month: "Des", expense: 3.2 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMonthlyExpense = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/users/monthly-expense?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch monthly expense");
        }

        const data = await response.json();
        setChartData(data.chartData);
        setError(null);
      } catch (err) {
        console.error("Error fetching monthly expense:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyExpense();
  }, [userId]);

  return { chartData, isLoading, error };
};
