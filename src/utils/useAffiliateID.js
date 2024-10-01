// src/hooks/useAffiliateID.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";

const useAffiliateID = (callback) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const affiliateID = params.get("aff_id");

    if (affiliateID) {
      // Add click counts of affiliate
      api
        .post("/api/affiliate/status/addClicks", { aff_id: affiliateID })
        .then((res) => {
          if (res.data.status === 1) {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      callback(affiliateID); // Call the provided callback function
    }
  }, []);
};

export default useAffiliateID;
