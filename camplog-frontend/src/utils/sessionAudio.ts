// 모듈 레벨 싱글톤 — 페이지 이동해도 유지됨
const audio = new Audio('/🔥 공부할 때 듣는 장작 타는 소리 _ Fireplace sound [2TrgSww4Wf8].mp3')
audio.loop = true
audio.volume = 0.5

export const sessionAudio = {
  play:     () => audio.play().catch(() => {}),
  pause:    () => audio.pause(),
  stop:     () => { audio.pause(); audio.currentTime = 0 },
  setMuted: (m: boolean) => { audio.muted = m },
  isMuted:  () => audio.muted,
  isPlaying: () => !audio.paused,
}
