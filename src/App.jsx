import { useEffect } from "react";
import { resolveRoute } from "./routes";
import HomePage from "./pages/HomePage";
import CabinsIndexPage from "./pages/CabinsIndexPage";
import CabinDetailPage from "./pages/CabinDetailPage";
import PoliciesPage from "./pages/PoliciesPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import CookieConsent from "./components/CookieConsent";
import { trackEventOnce } from "./lib/analytics";

function RouteAnalytics({ route }) {
  useEffect(() => {
    const track = () => {
      if (route.kind === "home" || route.kind === "cabins") {
        trackEventOnce(`view_item_list:${route.path}`, "view_item_list", {
          cta_location: route.kind,
        });
      }
      if (route.kind === "cabin") {
        trackEventOnce(`view_item:${route.cabin.id}`, "view_item", {
          cta_location: "cabin_detail",
          item_id: route.cabin.id,
          item_name: route.cabin.name,
        });
      }
    };
    track();
    window.addEventListener("puchuman:analytics-consent", track);
    return () =>
      window.removeEventListener("puchuman:analytics-consent", track);
  }, [route]);

  return null;
}

export default function App() {
  const route = resolveRoute(window.location.pathname);

  let page;
  switch (route.kind) {
    case "home":
      page = <HomePage />;
      break;
    case "cabins":
      page = <CabinsIndexPage />;
      break;
    case "cabin":
      page = <CabinDetailPage cabin={route.cabin} />;
      break;
    case "policies":
      page = <PoliciesPage />;
      break;
    case "contact":
      page = <ContactPage />;
      break;
    case "privacy":
      page = <PrivacyPage />;
      break;
    default:
      page = <NotFoundPage />;
  }

  return (
    <>
      <RouteAnalytics route={route} />
      {page}
      <CookieConsent />
    </>
  );
}
