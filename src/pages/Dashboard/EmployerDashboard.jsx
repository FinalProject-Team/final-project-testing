import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  apiGetMyJobs,
  apiCreateJob,
  apiGetJobApplicants,
  apiUpdateApplicationStatus,
  apiUpdateJob,
  apiDeleteJob,
} from '../../services/api/api';
import styles from './EmployerDashboard.module.css';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary_min: '',
    salary_max: '',
    job_type: 'Full-time',
    skills: '',
  });

  // Fetch employer's jobs
  useEffect(() => {
    console.log('EmployerDashboard mounted');
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiGetMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('فشل تحميل الوظائف: ' + (err.response?.data?.message || err.message));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for a specific job
  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants((prev) => ({ ...prev, [jobId]: true }));
      const data = await apiGetJobApplicants(jobId);
      setApplicants((prev) => ({ ...prev, [jobId]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      console.error('فشل تحميل المتقدمين:', err);
      setApplicants((prev) => ({ ...prev, [jobId]: [] }));
    } finally {
      setLoadingApplicants((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  // Handle job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const payload = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        job_type: formData.job_type,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
      };

      await apiCreateJob(payload);
      setSuccess('تم إنشاء الوظيفة بنجاح!');
      setFormData({
        title: '',
        description: '',
        company: '',
        location: '',
        salary_min: '',
        salary_max: '',
        job_type: 'Full-time',
        skills: '',
      });
      setShowCreateForm(false);
      fetchMyJobs();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('فشل إنشاء الوظيفة: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle application status update
  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      setError('');
      await apiUpdateApplicationStatus(applicationId, status);
      setSuccess(`تم ${status === 'accepted' ? 'قبول' : 'رفض'} المتقدم بنجاح!`);
      
      // Refresh the expanded job's applicants
      if (expandedJob) {
        fetchApplicants(expandedJob);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('فشل تحديث حالة الطلب: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle job details
  const toggleJobDetails = (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
      if (!applicants[jobId]) {
        fetchApplicants(jobId);
      }
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return;

    try {
      setError('');
      await apiDeleteJob(jobId);
      setSuccess('تم حذف الوظيفة بنجاح!');
      fetchMyJobs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('فشل حذف الوظيفة: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>لوحة تحكم صاحب الوظائف</h1>
        <p>إدارة الوظائف والمتقدمين</p>
      </div>

      {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
      {success && <div className={styles.alert + ' ' + styles.success}>{success}</div>}

      {/* Create Job Button */}
      <div className={styles.topActions}>
        <button
          className={styles.createJobBtn}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <FaPlus /> إنشاء وظيفة جديدة
        </button>
      </div>

      {/* Create Job Form */}
      {showCreateForm && (
        <div className={styles.formContainer}>
          <h2>إنشاء وظيفة جديدة</h2>
          <form onSubmit={handleCreateJob}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="عنوان الوظيفة"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="اسم الشركة"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="الموقع"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
              >
                <option value="Full-time">دوام كامل</option>
                <option value="Part-time">دوام جزئي</option>
                <option value="Contract">عقد</option>
                <option value="Freelance">عمل حر</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <input
                type="number"
                placeholder="الراتب الأدنى"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              />
              <input
                type="number"
                placeholder="الراتب الأعلى"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              />
            </div>

            <textarea
              placeholder="وصف الوظيفة"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="5"
              required
            />

            <input
              type="text"
              placeholder="المهارات المطلوبة (مفصولة بفواصل)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />

            <div className={styles.formActions}>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'جاري الإنشاء...' : 'إنشاء الوظيفة'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className={styles.cancelBtn}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className={styles.jobsSection}>
        <h2>الوظائف المنشورة ({jobs.length})</h2>

        {loading ? (
          <div className={styles.loadingMessage}>جاري التحميل...</div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyMessage}>لا توجد وظائف منشورة حالياً</div>
        ) : (
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job._id} className={styles.jobCard}>
                <div className={styles.jobHeader} onClick={() => toggleJobDetails(job._id)}>
                  <div className={styles.jobInfo}>
                    <h3>{job.title}</h3>
                    <p className={styles.company}>{job.company}</p>
                    <div className={styles.jobMeta}>
                      <span className={styles.location}>📍 {job.location}</span>
                      <span className={styles.jobType}>{job.job_type}</span>
                      {job.salary_min && job.salary_max && (
                        <span className={styles.salary}>
                          {job.salary_min} - {job.salary_max}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.jobStats}>
                    <div className={styles.applicantCount}>
                      {applicants[job._id]?.length || 0} متقدم
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedJob === job._id && (
                  <div className={styles.jobDetails}>
                    <div className={styles.description}>
                      <h4>الوصف</h4>
                      <p>{job.description}</p>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className={styles.skills}>
                        <h4>المهارات المطلوبة</h4>
                        <div className={styles.skillsList}>
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className={styles.skillTag}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applicants Section */}
                    <div className={styles.applicantsSection}>
                      <h4>المتقدمون ({applicants[job._id]?.length || 0})</h4>
                      {loadingApplicants[job._id] ? (
                        <div className={styles.loadingMessage}>جاري تحميل المتقدمين...</div>
                      ) : applicants[job._id]?.length === 0 ? (
                        <div className={styles.emptyMessage}>لا يوجد متقدمون حتى الآن</div>
                      ) : (
                        <div className={styles.applicantsList}>
                          {applicants[job._id].map((applicant) => (
                            <div key={applicant._id} className={styles.applicantCard}>
                              <div className={styles.applicantInfo}>
                                <h5>{applicant.user_id?.first_name} {applicant.user_id?.last_name}</h5>
                                <p className={styles.email}>{applicant.user_id?.email}</p>
                                <p className={styles.appliedDate}>
                                  تاريخ التقديم: {new Date(applicant.applied_at).toLocaleDateString('ar-EG')}
                                </p>
                              </div>
                              <div className={styles.applicantStatus}>
                                <span className={`${styles.statusBadge} ${styles[applicant.status]}`}>
                                  {applicant.status === 'pending' && 'قيد الانتظار'}
                                  {applicant.status === 'accepted' && 'مقبول'}
                                  {applicant.status === 'rejected' && 'مرفوض'}
                                </span>
                              </div>
                              <div className={styles.applicantActions}>
                                {applicant.status === 'pending' && (
                                  <>
                                    <button
                                      className={styles.acceptBtn}
                                      onClick={() => handleUpdateApplicationStatus(applicant._id, 'accepted')}
                                      title="قبول المتقدم"
                                    >
                                      <FaCheck /> قبول
                                    </button>
                                    <button
                                      className={styles.rejectBtn}
                                      onClick={() => handleUpdateApplicationStatus(applicant._id, 'rejected')}
                                      title="رفض المتقدم"
                                    >
                                      <FaTimes /> رفض
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Job Actions */}
                    <div className={styles.jobActions}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteJob(job._id)}
                        title="حذف الوظيفة"
                      >
                        <FaTrash /> حذف
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
