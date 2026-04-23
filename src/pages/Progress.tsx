import { useNavigate } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'
import { store, KEYS } from '../utils/storage'
import { lifeProgress, yearProgress, monthProgress, weekProgress, dayProgress, quarterProgress } from '../utils/time'
import type { Profile } from '../types'

export function Progress() {
  const navigate = useNavigate()
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const lp = profile.dob ? lifeProgress(profile.dob, profile.lifeExpectancy ?? 80) : null

  const rings = [
    { pct: dayProgress(), color: 'oklch(55% 0.18 155)', label: 'Day', detail: `${new Date().getHours()}h of 24h` },
    { pct: weekProgress(), color: 'oklch(62% 0.14 240)', label: 'Week', detail: `Day ${(new Date().getDay() || 7)} of 7` },
    { pct: monthProgress(), color: 'oklch(72% 0.16 75)', label: 'Month', detail: `Day ${new Date().getDate()}` },
    { pct: quarterProgress(), color: 'oklch(60% 0.16 30)', label: 'Quarter', detail: `Q${Math.ceil((new Date().getMonth() + 1) / 3)}` },
    { pct: yearProgress(), color: 'oklch(62% 0.2 15)', label: 'Year', detail: `Day ${Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)} of 365` },
  ]

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">PERSPECTIVE</p>
        <h1 className="page-header__title">Life Progress</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--sp-5)', marginBottom: 'var(--sp-7)' }}>
        {rings.map(r => (
          <div key={r.label} className="progress-ring-card">
            <ProgressRing percent={r.pct} color={r.color} size={110} />
            <span className="progress-ring-card__label">{r.label}</span>
            <span className="progress-ring-card__detail">{r.detail}</span>
          </div>
        ))}
      </div>

      {lp ? (
        <div style={{ marginBottom: 'var(--sp-7)' }}>
          <h2 className="section-title">Your Life</h2>
          <div style={{ padding: 'var(--sp-6)', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', marginBottom: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-6)', flexWrap: 'wrap' }}>
              <ProgressRing percent={lp.percentLived} color="oklch(55% 0.15 300)" size={140} />
              <div>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--sp-2)' }}>
                  {lp.ageYears} years old
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {[
                    { label: 'Days lived', val: lp.ageDays.toLocaleString() },
                    { label: 'Days remaining', val: lp.daysRemaining.toLocaleString() },
                    { label: 'Weeks remaining', val: lp.weeksRemaining.toLocaleString() },
                    { label: 'Life expectancy', val: `${profile.lifeExpectancy ?? 80} years` },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', gap: 'var(--sp-4)', fontSize: 'var(--fs-sm)', alignItems: 'baseline' }}>
                      <span style={{ color: 'var(--clr-text-3)', minWidth: 160 }}>{s.label}</span>
                      <span style={{ fontWeight: 600 }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', fontStyle: 'italic', maxWidth: 480 }}>
            "The two most important days in your life are the day you were born, and the day you find out why." — Mark Twain
          </p>
        </div>
      ) : (
        <div style={{ padding: 'var(--sp-6)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>🎂</div>
          <h3 style={{ fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Add your date of birth</h3>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-4)' }}>
            See your life visualized — how much you've lived and what's still ahead.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/settings')}>Go to Settings</button>
        </div>
      )}
    </div>
  )
}
