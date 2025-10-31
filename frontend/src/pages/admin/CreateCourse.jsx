import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { courseAPI } from '../../services/api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await courseAPI.create(formData);
      setToast({ message: 'Course created successfully!', type: 'success' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Course</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <Input
              label="Course Name"
              type="text"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Course Code"
              type="text"
              placeholder="e.g., CS101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />

            <Input
              label="Semester"
              type="text"
              placeholder="e.g., Fall 2024"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              required
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}