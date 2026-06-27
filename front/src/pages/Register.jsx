import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/services'

const PREFS     = ['한식','일식','중식','양식','분식','치킨','피자','카페','채식','해산물']
const DISLIKES  = ['오이','고수','파','마늘','쑥갓','가지','당근','콩']
const REQ_TERMS = ['만 14세 이상입니다.','쇼핑 이용약관 동의','전자금융거래 이용약관 동의','개인정보 제3자 제공 동의']
const OPT_TERMS = ['마케팅 정보 수신 동의','광고성 정보 수신 동의']

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', password: '', password2: '', nickname: '', allergies: '',
    preferences: [], dislikes: [],
  })
  const [terms,   setTerms]   = useState({})
  const [agreeAll, setAgreeAll] = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const togglePref = (val, key) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }))

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked)
    const all = {}
    ;[...REQ_TERMS, ...OPT_TERMS].forEach(t => { all[t] = checked })
    setTerms(all)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!REQ_TERMS.every(t => terms[t])) return setError('필수 약관에 동의해주세요.')
    if (form.password !== form.password2) return setError('비밀번호가 일치하지 않습니다.')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message ?? '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-lg shadow-lg">
        <div className="text-center mb-6">
          <span className="text-4xl">🍽️</span>
          <h1 className="text-xl font-black mt-2">오늘의 메뉴</h1>
          <p className="text-sm text-gray-500 mt-1">회원정보를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 기본 정보 */}
          {[
            { label:'이메일 *',     type:'email',    key:'email',     ph:'이메일 입력' },
            { label:'닉네임 *',     type:'text',     key:'nickname',  ph:'닉네임 입력' },
            { label:'비밀번호 *',   type:'password', key:'password',  ph:'8자 이상' },
            { label:'비밀번호 확인 *', type:'password', key:'password2', ph:'비밀번호 재입력' },
          ].map(({ label, type, key, ph }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
              <input type={type} required className="input" placeholder={ph}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">알러지/제외 재료</label>
            <input type="text" className="input" placeholder="예: 오이, 갑각류, 땅콩"
              value={form.allergies}
              onChange={e => setForm({ ...form, allergies: e.target.value })} />
          </div>

          {/* 선호 음식 칩 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">좋아하는 음식</label>
            <div className="flex flex-wrap gap-2">
              {PREFS.map(p => (
                <button type="button" key={p}
                  onClick={() => togglePref(p, 'preferences')}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition-colors
                    ${form.preferences.includes(p) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">싫어하는 음식</label>
            <div className="flex flex-wrap gap-2">
              {DISLIKES.map(d => (
                <button type="button" key={d}
                  onClick={() => togglePref(d, 'dislikes')}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition-colors
                    ${form.dislikes.includes(d) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 약관 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="flex items-center gap-2 font-bold text-sm mb-3 cursor-pointer">
              <input type="checkbox" checked={agreeAll} onChange={e => handleAgreeAll(e.target.checked)}
                className="w-4 h-4 accent-red-500" />
              모두 확인하였으며 동의합니다.
            </label>
            <div className="space-y-1.5 border-t border-gray-200 pt-3">
              {REQ_TERMS.map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={!!terms[t]} onChange={e => setTerms({ ...terms, [t]: e.target.checked })}
                    className="w-3.5 h-3.5 accent-red-500" />
                  <span className="text-red-500 font-bold">[필수]</span> {t}
                </label>
              ))}
              {OPT_TERMS.map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input type="checkbox" checked={!!terms[t]} onChange={e => setTerms({ ...terms, [t]: e.target.checked })}
                    className="w-3.5 h-3.5 accent-red-500" />
                  <span className="text-gray-400">[선택]</span> {t}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? '가입 중...' : '동의하고 가입하기'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
