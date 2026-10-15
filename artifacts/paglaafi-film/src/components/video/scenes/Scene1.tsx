import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

export function Scene1() {
  const [showQuestion, setShowQuestion] = useState(true);
  useSceneTimer([{ time: 1550, callback: () => setShowQuestion(false) }]);
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#39232e', color: '#fffaf9' }}
      initial={{ clipPath: 'inset(0 0 0 0)', scale: 1.08 }}
      animate={{ clipPath: 'inset(0 0 0 0)', scale: 1 }}
      exit={{ scale: 1.11, opacity: 0, filter: 'blur(7px)', transition: { duration: 0.34, ease: [0.7, 0, 0.84, 0] as const } }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 23% 52%, #563342 0%, #39232e 54%, #2c1a23 100%)' }} />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '41vmin', height: '41vmin', left: '8%', top: '24%', border: '1px solid rgba(227,154,175,.25)' }}
        animate={{ scale: [0.96, 1.04, 0.96], rotate: [0, 4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg className="absolute" style={{ width: '50vmin', height: '70vmin', left: '3%', top: '12%' }} viewBox="0 0 500 700" aria-hidden="true">
        <path d="M140 190 C120 55 390 55 390 220 C390 340 250 330 250 465" fill="none" stroke="#e39aaf" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
        <circle cx="250" cy="570" r="16" fill="#e39aaf" />
      </svg>
      <div className="absolute" style={{ left: '16%', top: '34%', width: '72%', zIndex: 2 }}>
        {showQuestion && (
          <motion.p
            className="scene-label m-0"
            style={{ color: '#e39aaf', marginBottom: '2.3vmin' }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10, transition: { duration: 0.18 } }}
            transition={{ delay: 0.36, duration: 0.45 }}
          >
            UNE QUESTION ?
          </motion.p>
        )}
        <motion.h1
          className="film-display m-0"
          style={{ fontSize: '9.2vmin', lineHeight: 0.94, maxWidth: '70vmin' }}
          initial={{ opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ delay: 0.74, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          Vous n’êtes pas<br />
          <span style={{ color: '#e39aaf', fontStyle: 'italic' }}>seule.</span>
        </motion.h1>
        <motion.p
          className="film-sans m-0"
          style={{ marginTop: '3.3vmin', fontSize: '2.1vmin', letterSpacing: '.035em', color: 'rgba(255,250,249,.66)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.64, duration: 0.42 }}
        >
          PagLaafi · information et orientation
        </motion.p>
      </div>
      <motion.div
        className="absolute rounded-full"
        style={{ width: '2.5vmin', height: '2.5vmin', left: '83%', top: '18%', background: '#e39aaf' }}
        animate={{ scale: [1, 1.42, 1], opacity: [0.84, 1, 0.84] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '78vmin', height: '78vmin', left: '61%', top: '30%', border: '2px solid rgba(227,154,175,.72)' }}
        initial={{ scale: 0.12, opacity: 0 }}
        animate={{ scale: [0.12, 0.12, 0.3, 1.4], opacity: [0, 0, 0.75, 0] }}
        transition={{ duration: 4, times: [0, 0.58, 0.74, 1], ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute"
        style={{ width: '1px', height: '28vmin', left: '91%', bottom: '-5%', background: '#e39aaf', transformOrigin: 'bottom' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: [0, 1, 0], rotate: [-12, 15, 45] }}
        transition={{ duration: 2.6, delay: 1.2, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute"
        style={{ left: '46%', top: '7%', color: 'rgba(255,250,249,.13)', fontSize: '2vmin', letterSpacing: '.2em' }}
        animate={{ y: [0, 10, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        BURKINA FASO
      </motion.div>
    </motion.section>
  );
}
