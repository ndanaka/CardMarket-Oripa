// src/hooks/useAffiliateID.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";

const useAffiliateID = (callback) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const affiliateID = params.get("aff_id");
    const first = params.get("first");
    if (first) {
      // Add click counts of affiliate
      localStorage.setItem("affId", affiliateID);

      api
        .post("/api/affiliate/status/addClicks", { aff_id: affiliateID })
        .then((res) => {
          if (res.data.status === 1) {
          }
        })
        .catch((err) => {});
    }

    callback(affiliateID); // Call the provided callback function
  }, []);
};

export default useAffiliateID;
