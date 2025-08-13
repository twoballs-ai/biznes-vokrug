import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();

  // Если не авторизован, редиректим на страницу входа
  if (!isAuthenticated) {
    router.push('/');
    return <div>Загрузка...</div>;  // Или можешь отобразить что-то еще
  }

  return <>{children}</>;
};

export default ProtectedRoute;
