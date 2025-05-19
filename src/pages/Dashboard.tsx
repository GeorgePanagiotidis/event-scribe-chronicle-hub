import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p>Welcome to the dashboard!</p>
        <Button>Click me</Button>
      </div>
    </Layout>
  );
};

export default Dashboard;

