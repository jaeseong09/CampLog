import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import styles from './LoginPage.module.css'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function LoginForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('')
      setLoading(true)
      try {
        // access_token으로 userinfo 가져와서 백엔드로 전달
        const { data: auth } = await authApi.googleLogin(tokenResponse.access_token)
        setTokens(auth.token, auth.refreshToken)
        const { data: user } = await authApi.me()
        setUser(user)
        navigate('/dashboard')
      } catch {
        setError('Google 로그인에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => setError('Google 로그인에 실패했습니다.'),
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data: auth } = await authApi.login(email, password)
      setTokens(auth.token, auth.refreshToken)
      const { data: user } = await authApi.me()
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error
      setError(msg || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button type="button" className={styles.googleButton} onClick={() => googleLogin()} disabled={loading}>
        <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.08-6.08C34.46 3.05 29.5 1 24 1 14.82 1 7.07 6.48 3.65 14.18l7.08 5.5C12.43 13.36 17.75 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.42c-.54 2.93-2.18 5.41-4.64 7.08l7.18 5.57C43.18 37.27 46.1 31.33 46.1 24.5z"/>
          <path fill="#FBBC05" d="M10.73 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.73-4.32l-7.08-5.5A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.58 10.75l8.15-6.43z"/>
          <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.57C28.55 38.1 26.4 38.5 24 38.5c-6.25 0-11.57-3.86-13.27-9.18l-8.15 6.43C6.07 43.52 14.48 47 24 47z"/>
        </svg>
        Google로 계속하기
      </button>

      <div className={styles.divider}>
        <span>또는 이메일로</span>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.formGroup}>
        <input
          type="email"
          className={styles.input}
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="password"
          className={styles.input}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? '로그인 중...' : '캠프 입장하기'}
      </button>
    </form>
  )
}