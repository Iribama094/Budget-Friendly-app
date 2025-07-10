import React from 'react';

interface TestAssistantProps {
  onBack: () => void;
}

export const TestAssistant: React.FC<TestAssistantProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">TEST ASSISTANT</h1>
        <p className="text-gray-700 mb-4">If you can see this, the navigation is working!</p>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
