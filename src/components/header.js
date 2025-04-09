import React from "react";

const PageHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 py-12 text-white shadow-lg">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">
          Black Doctors Mentorship Programme
        </h1>
        <p className="text-xl text-gray-300 animate-fade-in-delay" >
          Empowering the next generation of medical professionals.
        </p>
      </div>
    </header>
  );
};

export default PageHeader;