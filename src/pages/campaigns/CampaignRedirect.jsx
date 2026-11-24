import { useEffect } from "react";
import { useParams } from "react-router";
import { baseUrl } from "../../axios";

const API_BASE_URL = (
  baseUrl ||
  import.meta.env.VITE_APP_API_URL ||
  "https://api.resvor.com"
).replace(/\/+$/, "");

export default function CampaignRedirect() {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      window.location.replace(`${API_BASE_URL}/campaigns/i/${id}`);
    }
  }, [id]);

  return null;
}
