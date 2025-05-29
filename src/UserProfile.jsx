import React from "react";
import "./UserProfile.css";

const UserProfile = ({ user, onClose, loading, error }) => {
  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Đang tải hồ sơ...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Lỗi</h2>
          <p>{error}</p>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Hồ sơ cá nhân</h2>
        <p><strong>Username:</strong> {user.username || "Chưa cập nhật"}</p>
        <p><strong>Full name:</strong> {user.fullName || "Chưa cập nhật"}</p>
        <p><strong>Email:</strong> {user.email || "Chưa cập nhật"}</p>
        <p><strong>Phone:</strong> {user.phone || "Chưa cập nhật"}</p>
        <p><strong>Loại người dùng:</strong> {user.userType || "Chưa cập nhật"}</p>
        <p><strong>Ngày sinh:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Chưa cập nhật"}</p>
        <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
        <p><strong>Trường học:</strong> {user.schoolName || "Chưa cập nhật"}</p>

        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default UserProfile;
