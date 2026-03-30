import { useState, useEffect } from "react";

export const useWeeklyScans = (userId) => {
  const [chartData, setChartData] = useState([
    { day: "Sen", scans: 45, visitors: 120 },
    { day: "Sel", scans: 52, visitors: 145 },
    { day: "Rab", scans: 38, visitors: 98 },
    { day: "Kam", scans: 61, visitors: 167 },
    { day: "Jum", scans: 73, visitors: 201 },
    { day: "Sab", scans: 89, visitors: 245 },
    { day: "Min", scans: 95, visitors: 278 },
  ]);
  const [totalScans, setTotalScans] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchWeeklyScans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/users/weekly-scans?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weekly scan data");
        }

        const data = await response.json();
        setChartData(data.chartData);
        setTotalScans(data.totalScans);
        setError(null);
      } catch (err) {
        console.error("Error fetching weekly scans:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyScans();
  }, [userId]);

  return { chartData, totalScans, isLoading, error };
};
