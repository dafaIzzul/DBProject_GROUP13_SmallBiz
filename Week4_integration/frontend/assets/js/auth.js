const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    window.location.href = '../login.html';
    return null;
  }
  
  return user;
};

const checkRole = (allowedRoles) => {
  const user = checkAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    alert('You do not have permission to access this page');
    window.location.href = '../login.html';
    return false;
  }
  return true;
};

const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../login.html';
};