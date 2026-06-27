import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { logout } from '../api/services'

export default function Header() {
  const { user, logout: ctxLogout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    ctxLogout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link to="/" className="text-xl font-black text-gray-900 flex items-center gap-1">
          🍽️ <span>오늘의 메뉴</span>
        </Link>

        {/* 네비 */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/"      className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">홈</Link>
          <Link to="/menu"  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">메뉴 찾기</Link>
          <Link to="/party" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">밥친구</Link>
        </nav>

        {/* 유저 영역 */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/mypage"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">
                  {user.nickname?.[0]}
                </span>
                {user.nickname}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm px-3 py-1.5">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary text-sm">로그인</Link>
              <Link to="/register" className="btn-primary  text-sm">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
