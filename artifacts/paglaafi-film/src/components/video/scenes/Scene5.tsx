import { motion } from 'framer-motion';
import logo from '@assets/paglaafi-logo.png';

export function Scene5() {
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#fffaf9', color: '#39232e' }}
      initial={{ clipPath: 'circle(0% at 88% 80%)', scale: 0.94 }}
      animate={{ clipPath: 'circle(150% at 88% 80%)', scale: 1 }}
      exit={{ clipPath: 'circle(0% at 27% 42%)', scale: 1.02, transition: { duration: 0.46, ease: [0.7, 0, 0.84, 0] as const } }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{ width: '62vmin', height: '62vmin', left: '50%', top: '46%', border: '1px solid rgba(167,72,105,.45)', transform: 'translate(-50%,-50%)' }}
        initial={{ scale: 0.58, rotate: -18, opacity: 0 }}
        animate={{ scale: [0.58, 1.04, 1], rotate: [-18, 4, 0], opacity: 1 }}
        transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '47vmin', height: '47vmin', left: '50%', top: '46%', border: '1px solid rgba(167,72,105,.2)', transform: 'translate(-50%,-50%)' }}
        animate={{ scale: [1, 1.035, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.p
        className="film-display m-0"
        style={{ position: 'absolute', top: '9%', width: '100%', textAlign: 'center', fontSize: '8.2vmin', lineHeight: 0.9, zIndex: 3 }}
        initial={{ opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }}
        animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
        transition={{ delay: 0.25, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      >
        À votre rythme.
      </motion.p>
      <motion.p
        className="film-display m-0"
        style={{ position: 'absolute', top: '20%', width: '100%', textAlign: 'center', fontSize: '5.3vmin', lineHeight: 1, color: '#a74869', fontStyle: 'italic', zIndex: 3 }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.52 }}
      >
        Vous n’êtes pas seule.
      </motion.p>
      <motion.img
        src={logo}
        alt="PagLaafi"
        className="absolute"
        style={{ left: '50%', top: '50%', width: '31vmin', height: '31vmin', objectFit: 'contain', transform: 'translate(-50%,-50%)', zIndex: 4 }}
        initial={{ opacity: 0, scale: 0.84, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.75, duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.p
        className="film-sans m-0"
        style={{ position: 'absolute', top: '72%', width: '100%', textAlign: 'center', fontSize: '3.1vmin', fontWeight: 600, letterSpacing: '.02em', color: '#a74869', zIndex: 3 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.45, duration: 0.44 }}
      >
        Informer · orienter · soutenir
      </motion.p>
      <motion.p
        className="film-sans m-0"
        style={{ position: 'absolute', bottom: '7%', width: '100%', textAlign: 'center', fontSize: '1.9vmin', color: '#806874', zIndex: 3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.82, duration: 0.44 }}
      >
        Ne remplace pas l’avis d’un professionnel de santé.
      </motion.p>
      <motion.div
        className="absolute"
        style={{ left: '50%', top: '46%', width: '62vmin', height: '62vmin', borderRadius: '50%', border: '2px solid #a74869', transform: 'translate(-50%,-50%)' }}
        initial={{ scale: 0.08, opacity: 0 }}
        animate={{ scale: [0.08, 0.2, 1.5], opacity: [0, 0.8, 0] }}
        transition={{ duration: 5, times: [0, 0.75, 1], ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ left: '27%', top: '42%', width: '2.5vmin', height: '2.5vmin', background: '#a74869', zIndex: 6 }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.section>
  );
}
