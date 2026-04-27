import styles from './UnlockModal.module.css'

const ITEM_LABELS: Record<string, string> = {
  tent:          '텐트',
  lantern:       '랜턴',
  squirrel:      '다람쥐',
  pigeon_nest:   '비둘기 둥지',
  constellation: '별자리 표지판',
}

interface Props {
  items: string[]
  onClose: () => void
}

export default function UnlockModal({ items, onClose }: Props) {
  if (items.length === 0) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.glow} />
        <div className={styles.logoWrap}>
          <img src="/logo.svg" alt="CampLog" className={styles.logo} />
        </div>
        <h2 className={styles.title}>새 아이템 해금!</h2>
        <p className={styles.subtitle}>캠프사이트가 성장했어요</p>
        <div className={styles.items}>
          {items.map(key => (
            <div key={key} className={styles.item}>
              <div className={styles.itemDot} />
              <span>{ITEM_LABELS[key] ?? key}</span>
            </div>
          ))}
        </div>
        <button className={styles.btn} onClick={onClose}>확인</button>
      </div>
    </div>
  )
}