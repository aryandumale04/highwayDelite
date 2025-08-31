import React from "react";
import { Trash2 } from "lucide-react"; // icon for delete
import spiralImage from "/top.png"; // your spiral image

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <img src={spiralImage} alt="Logo" className="w-6 h-6" />
          <span className="font-semibold text-lg">Dashboard</span>
        </div>
        <button className="text-blue-600 font-medium">Sign Out</button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 border">
        <h2 className="text-lg font-semibold">
          Welcome, Jonas Kahnwald !
        </h2>
        <p className="text-gray-600 text-sm">Email: xxxxxx@xxxx.com</p>
      </div>

      {/* Create Note Button */}
      <button className="bg-blue-600 text-white font-medium py-3 rounded-xl shadow mb-6">
        Create Note
      </button>

      {/* Notes Section */}
      <div>
        <h3 className="text-base font-semibold mb-3">Notes</h3>

        {/* Note 1 */}
        <div className="flex justify-between items-center bg-white border shadow rounded-xl px-4 py-3 mb-3">
          <span>Note 1</span>
          <Trash2 className="w-5 h-5 text-gray-500" />
        </div>

        {/* Note 2 */}
        <div className="flex justify-between items-center bg-white border shadow rounded-xl px-4 py-3">
          <span>Note 2</span>
          <Trash2 className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
