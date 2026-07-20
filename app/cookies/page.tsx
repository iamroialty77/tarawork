import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";
export const metadata: Metadata = { title: "Cookie Policy", description: "How TaraWork uses cookies and similar technologies." };
export default function CookiesPage() { return <PublicInfoPage eyebrow="Legal" title="Cookie Policy" introduction="TaraWork uses cookies and similar browser technologies to provide secure sessions, remember preferences, understand usage, and improve the service." sections={[
  { heading: "Essential technologies", paragraphs: ["Essential cookies support authentication, security, navigation, fraud prevention, and core account functionality. Disabling them may prevent parts of TaraWork from working."] },
  { heading: "Analytics and performance", paragraphs: ["TaraWork may use privacy-conscious analytics and performance services to understand visits, page performance, errors, and general product usage. These providers process technical information under their own service terms."] },
  { heading: "Your controls", paragraphs: ["You can delete or block cookies through browser settings. Browser privacy controls may also restrict analytics. Where applicable law requires consent for non-essential cookies, TaraWork will provide the required choice before using them."] },
]} />; }
