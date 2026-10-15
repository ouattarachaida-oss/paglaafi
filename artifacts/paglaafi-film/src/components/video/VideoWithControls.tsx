import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, Repeat, Volume2, VolumeX } from 'lucide-react';
import { SCENE_DURATIONS } from './VideoTemplate';
import VideoTemplate from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const SCENE_DETAILS: Record<string, { title: string; filePath: string }> = {
  opening: { title: 'Une question', filePath: 'src/components/video/scenes/Scene1.tsx' },
  conversation: { title: 'Écouter et comprendre', filePath: 'src/components/video/scenes/Scene2.tsx' },
  sources: { title: 'Des repères fiables', filePath: 'src/components/video/scenes/Scene3.tsx' },
  orientation: { title: 'Le prochain pas', filePath: 'src/components/video/scenes/Scene4.tsx' },
  signature: { title: 'À votre rythme', filePath: 'src/components/video/scenes/Scene5.tsx' },
};

function announceSceneSelection(index: number, sceneKeys: string[]) {
  const key = sceneKeys[index];
  const detail = SCENE_DETAILS[key];
  if (!detail?.filePath) return;
  window.parent.postMessage({
    type: 'REPLIT_VIDEO_SCENE_SELECTED',
    payload: {
      sceneIndex: index,
      sceneCount: sceneKeys.length,
      sceneTitle: detail.title,
      filePath: detail.filePath,
      lineNumber: 1,
    },
  }, '*');
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick, durations,
    activeDuration, activeStartTime, totalDuration, onSceneChange, jumpTo,
    toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const [muted, setMuted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const sensorRef = useRef<HTMLDivElement | null>(null);
  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    announceSceneSelection(index, sceneKeys);
  }, [jumpTo, sceneKeys]);

  useEffect(() => {
    if (!paused) return;
    const frozen = document.getAnimations().filter((animation) => animation.playState === 'running');
    frozen.forEach((animation) => animation.pause());
    return () => frozen.forEach((animation) => animation.play());
  }, [paused]);

  const onPointerEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(true);
  }, []);
  const onPointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(false);
  }, []);
  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true);
  }, [collapsed]);
  const onToggleCollapsed = useCallback(() => {
    setCollapsed((value) => {
      if (!value) {
        setHovering(false);
        setTapPinned(false);
      }
      return !value;
    });
  }, []);
  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const clearPin = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(event.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', clearPin);
    return () => document.removeEventListener('pointerdown', clearPin);
  }, [collapsed, tapPinned]);

  if (!isIframed) return <VideoTemplate />;
  const visible = !collapsed || hovering || tapPinned;

  return (
    <div className="relative h-screen w-full">
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        muted={muted}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <div className="w-full flex-1" aria-hidden="true" />
        <div
          className="flex items-center gap-3 px-5 py-3 transition-all duration-200"
          style={{
            background: 'rgba(49,31,40,.78)',
            backdropFilter: 'blur(14px)',
            transform: visible ? 'translateY(0)' : 'translateY(100%)',
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
          }}
          aria-hidden={!visible}
        >
          <ControlButton label={paused ? 'Reprendre' : 'Mettre en pause'} onClick={togglePause}>
            {paused ? <Play size={21} /> : <Pause size={21} />}
          </ControlButton>
          <ControlButton label={locked ? 'Boucle de scène activée' : 'Boucler cette scène'} pressed={locked} onClick={toggleLock}>
            <Repeat size={21} />
          </ControlButton>
          <ControlButton label={muted ? 'Activer le son' : 'Couper le son'} pressed={muted} onClick={() => setMuted((value) => !value)}>
            {muted ? <VolumeX size={21} /> : <Volume2 size={21} />}
          </ControlButton>
          <div aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,.2)' }} />
          <PlaybackStatus
            sceneKeys={sceneKeys}
            activeIndex={activeIndex}
            activeDuration={activeDuration}
            activeStartTime={activeStartTime}
            totalDuration={totalDuration}
            tick={tick}
            paused={paused}
            onJumpTo={handleJumpTo}
          />
          <ControlButton label={collapsed ? 'Afficher les commandes' : 'Masquer les commandes'} onClick={onToggleCollapsed}>
            {collapsed ? <ChevronUp size={23} /> : <ChevronDown size={23} />}
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  pressed = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15"
      style={{ background: pressed ? 'rgba(255,255,255,.16)' : 'transparent' }}
    >
      {children}
    </button>
  );
}

function PlaybackStatus({
  sceneKeys,
  activeIndex,
  activeDuration,
  activeStartTime,
  totalDuration,
  tick,
  paused,
  onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const elapsedBaseRef = useRef(0);
  useEffect(() => {
    setElapsed(0);
    elapsedBaseRef.current = 0;
  }, [tick]);
  useEffect(() => {
    if (paused) return;
    const started = performance.now();
    const id = window.setInterval(() => setElapsed(elapsedBaseRef.current + performance.now() - started), 60);
    return () => {
      window.clearInterval(id);
      elapsedBaseRef.current += performance.now() - started;
    };
  }, [tick, paused]);
  const progress = activeDuration ? Math.min(1, elapsed / activeDuration) : 0;
  const absoluteTime = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));
  return (
    <>
      <div className="flex flex-1 items-center gap-1.5">
        {sceneKeys.map((key, index) => (
          <button
            key={key}
            type="button"
            aria-label={`Aller à la scène ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => onJumpTo(index)}
            className="relative h-2.5 min-h-3 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/25"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-rose-100 transition-[width] duration-100"
              style={{ width: `${index < activeIndex ? 100 : index === activeIndex ? progress * 100 : 0}%` }}
            />
          </button>
        ))}
      </div>
      <span className="shrink-0 font-mono text-sm text-white/75">{activeIndex + 1}/{sceneKeys.length}</span>
      <span className="min-w-[10ch] shrink-0 text-right font-mono text-sm tabular-nums text-white/80" role="timer" aria-label={`${formatTime(absoluteTime)} sur ${formatTime(totalDuration)}`}>
        {formatTime(absoluteTime)} / {formatTime(totalDuration)}
      </span>
    </>
  );
}

function formatTime(durationMs: number) {
  const wholeSeconds = Math.max(0, Math.floor(durationMs / 1000));
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}
