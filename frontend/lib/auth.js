// lib/auth.js

export const saveSession = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getSession = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (!token || !user) return null;
    return { token, user: JSON.parse(user) };
  };
  
  export const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  export const isLoggedIn = () => {
    return !!getSession();
  };
  
  export const saveAdminSession = (token, admin) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('admin', JSON.stringify(admin));
  };
  
  export const getAdminSession = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('admin');
    if (!token || !admin) return null;
    return { token, admin: JSON.parse(admin) };
  };
  
  export const clearAdminSession = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  };
 