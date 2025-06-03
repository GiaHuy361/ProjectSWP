
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CourseRegistrationPage.module.css';

// Hàm chuẩn hóa chuỗi tiếng Việt có dấu thành không dấu
const removeDiacritics = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export default function CourseRegistrationPage() {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]); // Thêm state permissions
  const [registering, setRegistering] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/user', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ userId: data.userId, email: data.email, permissions: data.permissions || [] });
        setPermissions(data.permissions || []); // Lấy permissions từ API
        localStorage.setItem('email', data.email);
        return true;
      }
      localStorage.removeItem('email');
      setUser(null);
      setPermissions([]); // Reset permissions nếu không đăng nhập
      setRegisteredCourses([]);
      return false;
    } catch (err) {
      console.error('Error checking login status:', err);
      localStorage.removeItem('email');
      setUser(null);
      setPermissions([]);
      setRegisteredCourses([]);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      const isLoggedIn = await checkLoginStatus();
      if (isLoggedIn) {
        await fetchRegisteredCourses();
      }
      setAuthLoading(false);
    };
    init();
  }, [location.pathname]);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      setAuthLoading(true);
      await checkLoginStatus();
      setAuthLoading(false);
    };

    const handleLogoutSuccess = () => {
      setUser(null);
      setPermissions([]); // Reset permissions khi logout
      setRegisteredCourses([]);
      navigate('/home');
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logoutSuccess', handleLogoutSuccess);
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logoutSuccess', handleLogoutSuccess);
    };
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchRegisteredCourses();
    }
  }, [user]);

  const fetchRegisteredCourses = async () => {
    if (!user) {
      setRegisteredCourses([]);
      return;
    }
    try {
      console.log('Fetching registered courses for user:', user);
      const res = await fetch('http://localhost:8080/api/courses/registrations', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Registered courses:', data);
        setRegisteredCourses(data.map(reg => reg.courseId));
      } else {
        console.error('Failed to fetch registered courses:', res.status);
        setRegisteredCourses([]);
      }
    } catch (err) {
      console.error('Error fetching registered courses:', err);
      setRegisteredCourses([]);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8080/api/courses', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Không thể tải danh sách khóa học');
        const data = await res.json();
        const normalizedData = data.map(course => ({
          ...course,
          normalizedText: removeDiacritics(
            [course.title || '', course.description || '', course.ageRange || ''].join(' ')
          ).toLowerCase(),
        }));
        setCourses(normalizedData);
      } catch (err) {
        setError(err.message);
        alert(`Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const ageRangeMap = {
    'Học sinh': '12-18 tuổi',
    'Sinh viên': '18-25 tuổi',
    'Phụ huynh': 'Trên 25 tuổi',
    'Giáo viên': 'Trên 22 tuổi',
  };

  const filteredCourses = courses.filter((course) => {
    const searchTerm = removeDiacritics(search.trim()).toLowerCase();
    if (!searchTerm) {
      const matchFilter = filter ? course.ageRange === ageRangeMap[filter] : true;
      return matchFilter;
    }

    const searchWords = searchTerm.split(/\s+/);
    const matchSearch = searchWords.every(word => course.normalizedText.includes(word));

    const matchFilter = filter ? course.ageRange === ageRangeMap[filter] : true;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const canRegister = user && permissions.includes('register_course'); // Kiểm tra quyền register_course

  const handleRegister = async (course) => {
    if (!user) {
      const isLoggedIn = await checkLoginStatus();
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để đăng ký khóa học.');
        navigate('/login');
        return;
      }
    }
    if (!canRegister) {
      alert('Bạn không có quyền đăng ký khóa học này. Vui lòng liên hệ quản trị viên.');
      return;
    }

    setRegistering(course.courseId);
    try {
      const registrationData = {
        userId: user.userId,
        courseId: course.courseId,
      };
      const res = await fetch(`http://localhost:8080/api/courses/${course.courseId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) {
          alert('Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.');
          localStorage.clear();
          navigate('/login');
          return;
        }
        throw new Error(errorData?.message || 'Lỗi không xác định');
      }
      await res.json();
      alert(`Đăng ký khóa học "${course.title}" thành công!`);
      await fetchRegisteredCourses();
      setRegisteredCourses([...registeredCourses, course.courseId]);
    } catch (err) {
      console.error('Error registering course:', err);
      alert(`Lỗi đăng ký khóa học: ${err.message}`);
    } finally {
      setRegistering(null);
    }
  };

  const handleGoToCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading || authLoading) return <p>Đang tải...</p>;
  if (error) return <p className={styles.error}>Lỗi: {error}. Vui lòng thử lại sau.</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}></aside>
      <main className={styles.mainSection}>
        <div className={styles.searchFilter}>
          <input
            type='text'
            placeholder='Tìm kiếm khóa học về phòng ngừa ma túy...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label='Tìm kiếm khóa học'
          />
          <div className={styles.filterButtons}>
            {['Học sinh', 'Sinh viên', 'Phụ huynh', 'Giáo viên'].map((type) => (
              <button
                key={type}
                className={filter === type ? styles.activeFilter : styles.filterBtn}
                onClick={() => setFilter(filter === type ? null : type)}
                aria-pressed={filter === type}
                type='button'
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.courseList}>
          {currentCourses.length === 0 ? (
            <p>Không tìm thấy khóa học phù hợp.</p>
          ) : (
            currentCourses.map((course) => (
              <div key={course.courseId} className={styles.courseCard}>
                {course.ageRange && (
                  <span
                    className={`${styles.badge} ${styles[course.ageRange.replace(' ', '').toLowerCase()]}`}
                  >
                    {course.ageRange}
                  </span>
                )}
                <h3 className={styles.title}>{course.title}</h3>
                <p className={styles.description}>{course.description}</p>
                <div className={styles.info}>
                  {course.ageRange && <span>Tuổi: {course.ageRange}</span>}
                  {course.duration && <span>Thời gian: {course.duration}</span>}
                  {course.ratingAvg !== undefined && course.ratingCount !== undefined && (
                    <span>
                      Đánh giá: <span className={styles.starIcon}>★</span> {course.ratingAvg} ({course.ratingCount} lượt)
                    </span>
                  )}
                </div>
                {registeredCourses.includes(course.courseId) ? (
                  <button
                    className={styles.registerBtn}
                    onClick={() => handleGoToCourse(course.courseId)}
                    type='button'
                  >
                    Vào học
                  </button>
                ) : (
                  <button
                    className={styles.registerBtn}
                    onClick={() => handleRegister(course)}
                    type='button'
                    disabled={loading || registering === course.courseId}
                  >
                    {registering === course.courseId ? 'Đang đăng ký...' : 'Đăng ký'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
