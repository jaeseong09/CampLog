import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function SignupForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    try {
      await authApi.signup(email, password, nickname)
      // 가입 후 자동 로그인
      const { data: auth } = await authApi.login(email, password)
      setTokens(auth.token, auth.refreshToken)
      const { data: user } = await authApi.me()
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error
      setError(msg || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.formGroup}>
        <label htmlFor="nickname" className={styles.label}>닉네임</label>
        <input
          type="text"
          id="nickname"
          className={styles.input}
          placeholder="닉네임을 입력하세요 (2~20자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signupEmail" className={styles.label}>이메일</label>
        <input
          type="email"
          id="signupEmail"
          className={styles.input}
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signupPassword" className={styles.label}>비밀번호</label>
        <input
          type="password"
          id="signupPassword"
          className={styles.input}
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          className={styles.input}
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? '가입 중...' : '회원가입하기'}
      </button>
    </form>
  )
}