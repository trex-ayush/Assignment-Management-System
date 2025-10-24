import { formatDate } from "../../utils/helpers";
import Card from "../common/Card";
import Button from "../common/Button";

export default function AssignmentCard({
  assignment,
  onSubmit,
  submissions = [],
}) {
  console.log("Assingnment : ", assignment);

  const isOverdue = new Date(assignment.due_date) < new Date();
  const isSubmitted = submissions.some(
    (s) => s.assignment_id === assignment.id
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isSubmitted
              ? "bg-green-100 text-green-700"
              : isOverdue
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isSubmitted ? "Submitted" : isOverdue ? "Overdue" : "Pending"}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {assignment.description}
      </p>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Professor:</span>
          <span>{assignment.professor_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Due Date:</span>
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {formatDate(assignment.due_date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Submissions:</span>
          <span>{assignment.total_submissions || 0}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={assignment.onedrive_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary flex-1 text-center"
        >
          View Files
        </a>
        {!isSubmitted && (
          <Button onClick={() => onSubmit(assignment)} className="flex-1">
            Submit
          </Button>
        )}
      </div>
    </Card>
  );
}
