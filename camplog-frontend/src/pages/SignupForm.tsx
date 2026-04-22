import styles from './LoginPage.module.css'

export default function SignupForm() {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>사용자 이름</label>
        <input
          type="text"
          id="username"
          name="username"
          className={styles.input}
          placeholder="사용자 이름을 입력하세요"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signupEmail" className={styles.label}>이메일</label>
        <input
          type="email"
          id="signupEmail"
          name="email"
          className={styles.input}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signupPassword" className={styles.label}>비밀번호</label>
        <input
          type="password"
          id="signupPassword"
          name="password"
          className={styles.input}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={styles.input}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        회원가입하기
      </button>
    </form>
  )
}
