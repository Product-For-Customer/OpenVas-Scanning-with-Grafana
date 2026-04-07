import React, { useEffect, useState } from "react";
import HistoryNotify from "./history";
import Notify from "./notify";
import Graph from "./graph";
import Count from "./count";
import {
  ListHistoryNotify,
  type HistoryNotifyResponse,
} from "../../services";

const Index: React.FC = () => {
  const [items, setItems] = useState<HistoryNotifyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchHistoryNotify = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await ListHistoryNotify();

      if (Array.isArray(res)) {
        setItems(res);
      } else {
        setItems([]);
        setError("Unable to load notification history.");
      }
    } catch (err) {
      console.error("fetchHistoryNotify error:", err);
      setItems([]);
      setError("Unable to load notification history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryNotify();
  }, []);

  return (
    <div className="w-full">
      {/* Row 1: Notify full width */}
      <div className="mb-4">
        <Notify />
      </div>

      {/* Row 2: Count / Graph */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-10">
        <div className="xl:col-span-6 h-full">
          <Count
            items={items}
            loading={loading}
            refreshing={refreshing}
            error={error}
            onRefresh={fetchHistoryNotify}
          />
        </div>

        <div className="xl:col-span-4 h-full">
          <Graph
            items={items}
            loading={loading}
            refreshing={refreshing}
            error={error}
            onRefresh={fetchHistoryNotify}
          />
        </div>
      </div>

      {/* Row 3: History full width */}
      <div>
        <HistoryNotify
          items={items}
          setItems={setItems}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={fetchHistoryNotify}
        />
      </div>
    </div>
  );
};

export default Index;