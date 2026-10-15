import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

export function Scene4() {
  const [revealed, setRevealed] = useState(0);
  useSceneTimer([
    { time: 1050, callback: () => setRevealed(1) },
    { time: 1770, callback: () => setRevealed(2) },
    { time: 2530, callback: () => setRevealed(3) },
  ]);
  const labels = [
    { title: 'Comprendre', x: '19%', y: '40%', rotate: -7 },
    { title: 'Centres', x: '45%', y: '53%', rotate: 5 },
    { title: 'Soutien', x: '69%', y: '36%', rotate: -4 },
  ];
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#fffaf9', color: '#39232e' }}
      initial={{ clipPath: 'inset(0 0 0 100%)', scale: 1.04 }}
      animate={{ clipPath: 'inset(0 0 0 0)', scale: 1 }}
      exit={{ scale: 1.12, opacity: 0, filter: 'blur(6px)', transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] as const } }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute rounded-full" style={{ width: '90vmin', height: '90vmin', right: '-19%', top: '-41%', background: '#f9e9ed' }} />
      <motion.h2
        className="film-display m-0"
        style={{ position: 'absolute', left: '7%', top: '9%', maxWidth: '70%', fontSize: '7.4vmin', lineHeight: 0.91, zIndex: 4 }}
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        Trouver son prochain pas.
      </motion.h2>
      <svg className="absolute" style={{ inset: '0', width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M90 625 C300 390 460 680 700 480 C920 300 1100 550 1510 270" fill="none" stroke="#f9e9ed" strokeWidth="116" strokeLinecap="round" />
        <path d="M90 625 C300 390 460 680 700 480 C920 300 1100 550 1510 270" fill="none" stroke="#a74869" strokeWidth="5" strokeLinecap="round" strokeDasharray="12 15" />
        <path className="film-line" d="M90 625 C300 390 460 680 700 480 C920 300 1100 550 1510 270" pathLength="1" stroke="#a74869" strokeWidth="4" />
      </svg>
      {labels.map((label, index) => (
        <motion.div
          key={label.title}
          className="absolute"
          style={{ left: label.x, top: label.y, zIndex: 3, transformOrigin: 'center' }}
          initial={{ opacity: 0, scale: 0.8, rotate: label.rotate + 12 }}
          animate={revealed > index ? { opacity: 1, scale: 1, rotate: label.rotate } : {}}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ padding: '2.1vmin 3.3vmin', minWidth: '24vmin', background: index === 1 ? '#39232e' : '#fffaf9', color: index === 1 ? '#fffaf9' : '#39232e', border: '1px solid rgba(57,35,46,.16)', boxShadow: '0 1.8vmin 4.8vmin rgba(57,35,46,.12)' }}>
            <p className="scene-label m-0" style={{ fontSize: '1.45vmin', opacity: 0.72, marginBottom: '0.8vmin' }}>PAGLAAFI</p>
            <p className="film-display m-0" style={{ fontSize: '4.1vmin', lineHeight: 0.98 }}>{label.title}</p>
            {index === 1 && (
              <p className="film-sans m-0" style={{ marginTop: '1.1vmin', maxWidth: '25vmin', fontSize: '1.8vmin', lineHeight: 1.3, color: '#f2b8c8' }}>
                Listes locales publiées après vérification.
              </p>
            )}
          </div>
        </motion.div>
      ))}
      <motion.div
        className="absolute scene-label"
        style={{ left: '7%', bottom: '7%', color: '#806874', zIndex: 3 }}
        initial={{ opacity: 0, y: 9 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.65, duration: 0.42 }}
      >
        BURKINA FASO · repères et ressources
      </motion.div>
      <motion.div
        className="absolute"
        style={{ width: '4vmin', height: '4vmin', right: '5%', bottom: '12%', borderRadius: '50%', background: '#a74869', zIndex: 4 }}
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.section>
  );
}
