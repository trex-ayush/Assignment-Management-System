import { Link } from 'react-router-dom';
import Card from '../common/Card';

export default function CourseCard({ course }) {
  const completionPercentage = course.total_assignments > 0
    ? Math.round((course.acknowledged_count / course.total_assignments) * 100)
    : 0;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-slideIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.code} • {course.semester}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {course.total_assignments} Assignments
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Professor: <span className="font-medium">{course.professor_name}</span>
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 text-xs mb-4">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-gray-600">{course.acknowledged_count} Done</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span className="text-gray-600">{course.pending_count} Pending</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link 
          to={`/courses/${course.id}/groups`}
          className="btn btn-secondary text-sm flex-1 text-center"
        >
          👥 My Group
        </Link>
        <Link 
          to={`/courses/${course.id}/assignments`}
          className="btn btn-primary text-sm flex-1 text-center"
        >
          📝 Assignments
        </Link>
      </div>
    </Card>
  );
}