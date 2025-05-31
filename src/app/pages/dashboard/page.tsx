import dynamic from "next/dynamic";
// import { Dashboard } from "./dashboard";
const Dashboard = dynamic(() => import('./dashboard'), {
  ssr: false,
});


const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
