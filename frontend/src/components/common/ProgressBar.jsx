export default function ProgressBar({ percentage = 0, label, showLabel = true }) {
  const safePercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-blue-600">{safePercentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}