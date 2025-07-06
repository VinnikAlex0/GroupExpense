import React from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            💸 GroupExpense
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Collaborative expense splitter that helps groups track shared
            expenses and split costs fairly. Perfect for holidays, house shares,
            or weekend getaways.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Cards */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              Create Groups
            </h3>
            <p className="text-secondary-600">
              Easily create groups and invite members with shareable links
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              Track Expenses
            </h3>
            <p className="text-secondary-600">
              Add expenses with descriptions, categories, and payment details
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              Auto Calculate
            </h3>
            <p className="text-secondary-600">
              Automatically calculates who owes what and simplifies settling up
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
