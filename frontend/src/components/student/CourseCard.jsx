import { Link } from 'react-router-dom';
import Card from '../common/Card';

export default function CourseCard({ course }) {
  const completionPercentage = course.total_assignments > 0
    ? Math.round((course.acknowledged_count / course.total_assignments) * 100)
    : 0;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.code} • {course.semester}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
          {course.total_assignments} Tasks
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Professor</p>
          <p className="text-sm font-semibold text-gray-900">{course.professor_name}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Done</p>
            <p className="text-sm font-bold text-gray-900">{course.acknowledged_count}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-sm font-bold text-gray-900">{course.pending_count}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link 
          to={`/courses/${course.id}/groups`}
          className="btn btn-secondary text-sm flex-1 text-center flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          My Group
        </Link>
        <Link 
          to={`/courses/${course.id}/assignments`}
          className="btn btn-primary text-sm flex-1 text-center flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Assignments
        </Link>
      </div>
    </Card>
  );
}