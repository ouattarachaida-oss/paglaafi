import { motion } from 'framer-motion';

export function Scene2() {
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#39232e' }}
      initial={{ clipPath: 'circle(0% at 76% 50%)', scale: 1.08 }}
      animate={{ clipPath: 'circle(150% at 76% 50%)', scale: 1 }}
      exit={{ clipPath: 'circle(0% at 73% 49%)', scale: 0.96, opacity: 0, transition: { duration: 0.42, ease: [0.7, 0, 0.84, 0] as const } }}
      transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={`${import.meta.env.BASE_URL}images/community-conversation.png`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '45% center', transform: 'scale(1.025)' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(36,22,29,.05) 0%, rgba(36,22,29,.08) 46%, rgba(48,28,38,.76) 100%), linear-gradient(0deg, rgba(31,19,25,.32), transparent 42%)' }} />
      <motion.div
        className="absolute"
        style={{ inset: '-10%', border: '1px solid rgba(255,250,249,.32)', borderRadius: '50%' }}
        initial={{ scale: 0.72, rotate: -13 }}
        animate={{ scale: [0.72, 0.91, 1.04], rotate: [-13, -3, 1] }}
        transition={{ duration: 4.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute"
        style={{ right: '9%', top: '22%', width: '37%', color: '#fffaf9', zIndex: 2 }}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.32, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="scene-label m-0" style={{ color: '#f2b8c8', marginBottom: '2vmin' }}>À VOTRE RYTHME</p>
        <motion.h2
          className="film-display m-0"
          style={{ fontSize: '8.8vmin', lineHeight: 0.9, letterSpacing: '-.04em' }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.56 }}
        >
          Écouter.
        </motion.h2>
        <motion.h2
          className="film-display m-0"
          style={{ fontSize: '8.8vmin', lineHeight: 0.9, letterSpacing: '-.04em', color: '#f2b8c8', marginTop: '1.1vmin' }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.58 }}
        >
          Comprendre.
        </motion.h2>
        <motion.p
          className="film-sans m-0"
          style={{ fontSize: '3.1vmin', lineHeight: 1.24, maxWidth: '44vmin', marginTop: '3.4vmin', color: 'rgba(255,250,249,.84)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.75, duration: 0.48 }}
        >
          Des repères clairs,<br />à votre rythme.
        </motion.p>
      </motion.div>
      <motion.div
        className="absolute"
        style={{ left: '6%', bottom: '7%', color: '#fffaf9', zIndex: 3 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.28, duration: 0.44 }}
      >
        <span className="scene-label">Une présence, sans jugement.</span>
      </motion.div>
      <motion.div
        className="absolute"
        style={{ right: '-13%', top: '-22%', width: '48vmin', height: '48vmin', borderRadius: '50%', border: '3px solid #a74869' }}
        initial={{ scale: 0.7, rotate: -15 }}
        animate={{ scale: [0.7, 0.94, 1.18], rotate: [-15, 0, 12] }}
        transition={{ duration: 5, ease: 'easeInOut' }}
      />
    </motion.section>
  );
}
