import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#f9e9ed', color: '#39232e' }}
      initial={{ clipPath: 'inset(0 0 100% 0)', rotate: -2 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', rotate: 0 }}
      exit={{ clipPath: 'inset(0 0 0 100%)', scale: 0.96, opacity: 0, transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] as const } }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute" style={{ left: '-10%', top: '-48%', width: '64vmin', height: '64vmin', border: '1px solid rgba(167,72,105,.26)', borderRadius: '50%' }} />
      <div className="absolute" style={{ left: '8%', top: '18%', zIndex: 3 }}>
        <motion.p
          className="scene-label m-0"
          style={{ color: '#a74869', marginBottom: '1.4vmin' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
        >
          SAVOIR, SANS S’AFFOLER
        </motion.p>
        <motion.h2
          className="film-display m-0"
          style={{ fontSize: '11vmin', lineHeight: 0.86, letterSpacing: '-.05em' }}
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ delay: 0.37, duration: 0.65 }}
        >
          Des repères.
        </motion.h2>
      </div>
      <motion.div
        className="absolute"
        style={{ right: '10%', top: '16%', width: '40%', height: '64%', zIndex: 2 }}
        initial={{ rotate: 6, x: 20, opacity: 0 }}
        animate={{ rotate: 0, x: 0, opacity: 1 }}
        transition={{ delay: 0.42, duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ position: 'absolute', inset: '8% 3% 2% 15%', background: '#f4d5de', border: '1px solid rgba(57,35,46,.12)' }} animate={{ rotate: [-4, -2, -4], y: [0, 5, 0] }} transition={{ duration: 3.3, repeat: Infinity }} />
        <motion.div style={{ position: 'absolute', inset: '4% 9% 6% 7%', background: '#fffaf9', border: '1px solid rgba(57,35,46,.12)', boxShadow: '0 3vmin 9vmin rgba(57,35,46,.11)' }} animate={{ rotate: [2, 0, 2], y: [0, -5, 0] }} transition={{ duration: 3.3, repeat: Infinity, delay: 0.25 }} />
        <div className="absolute" style={{ left: '19%', right: '20%', top: '23%', height: '1px', background: '#d4b6c0' }} />
        <div className="absolute" style={{ left: '19%', right: '31%', top: '32%', height: '1px', background: '#d4b6c0' }} />
        <div className="absolute" style={{ left: '19%', right: '26%', top: '41%', height: '1px', background: '#d4b6c0' }} />
        <div className="absolute flex items-center justify-center rounded-full film-display" style={{ left: '50%', top: '60%', width: '21vmin', height: '21vmin', transform: 'translate(-50%,-50%)', background: '#39232e', color: '#fffaf9', fontSize: '4.6vmin' }}>
          OMS
        </div>
        <motion.div className="absolute" style={{ left: '16%', right: '17%', top: '23%', height: '1px', background: '#a74869', transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.7 }} />
      </motion.div>
      <motion.p
        className="film-sans m-0"
        style={{ position: 'absolute', left: '8%', top: '48%', width: '37%', fontSize: '3.15vmin', lineHeight: 1.25, zIndex: 4 }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.18, duration: 0.48 }}
      >
        Des contenus pédagogiques<br />citant l’OMS.
      </motion.p>
      <motion.p
        className="film-sans m-0"
        style={{ position: 'absolute', left: '8%', top: '66%', width: '38%', fontSize: '2.65vmin', lineHeight: 1.28, color: '#806874', zIndex: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.75, duration: 0.48 }}
      >
        Une information générale —<br />pas un diagnostic.
      </motion.p>
      <motion.div
        className="absolute scene-label"
        style={{ left: '8%', bottom: '8%', color: '#806874', zIndex: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.45, duration: 0.4 }}
      >
        Organisation mondiale de la Santé
      </motion.div>
      <motion.div
        className="absolute"
        style={{ right: '6%', bottom: '-40%', width: '39vmin', height: '39vmin', borderRadius: '50%', background: '#a74869' }}
        initial={{ scale: 0.14 }}
        animate={{ scale: [0.14, 0.3, 1.8] }}
        transition={{ duration: 5, times: [0, 0.69, 1], ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.section>
  );
}
