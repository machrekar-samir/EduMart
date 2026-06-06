import logoImg from '../assets/EduMartX-Logo.jpeg'

export default function LogoIcon({ size = 36, className = '' }) {
  return (
    <span
      className={`logo-icon ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img src={logoImg} alt="" width={size} height={size} />
    </span>
  )
}
