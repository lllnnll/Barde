import { useEffect, useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import React, { JSX } from 'react';

// replace icons with your own if needed
import { FiCircle, FiCode, FiFileText, FiLayers, FiLayout } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { spotifyService } from '../services/spotifyService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  onActiveChange?: (item: CarouselItem, index: number) => void;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: 'Spotify',
    description: 'Connect your Spotify account.',
    id: 1,
    icon: <FaSpotify />
  },
  {
    title: 'Apple Music',
    description: 'Connect your Apple Music account.',
    id: 2,
    icon: <></>
  },
  {
    title: 'Deezer',
    description: 'Connect your Deezer account.',
    id: 3,
    icon: <></>
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  onActiveChange
}: CarouselProps): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkSpotifyStatus = async () => {
      if (!user) return;
      try {
        const status = await spotifyService.getStatus();
        setIsSpotifyConnected(status.connected);
      } catch (err) {
        console.error('Failed to get Spotify status:', err);
      }
    };
    checkSpotifyStatus();
  }, [user]);

  const handleConnectSpotify = async () => {
    try {
      const url = await spotifyService.getAuthUrl();
      window.location.href = url;
    } catch (err) {
      console.error('Failed to get Spotify auth URL:', err);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, carouselItems.length, pauseOnHover]);

  // Notify consumer when active item changes
  useEffect(() => {
    if (!onActiveChange) return;
    const effectiveIndex = currentIndex % items.length;
    const item = items[effectiveIndex];
    onActiveChange(item, effectiveIndex);
  }, [currentIndex, items, onActiveChange]);

  const effectiveTransition: any = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(prev => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
      dragConstraints: {
        left: -trackItemOffset * (carouselItems.length - 1),
        right: 0
      }
    };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${round ? 'rounded-full' : 'rounded-[24px] border border-[#222]'
        }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` })
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
          const outputRange = [90, 0, -90];
          const rotateY = useTransform(x, range, outputRange, { clamp: false });
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col ${round
                ? 'items-center justify-center text-center'
                : 'items-start justify-between bg-[#222] rounded-[12px]'
                } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : '100%',
                rotateY: rotateY,
                ...(round && { borderRadius: '50%' })
              }}
              transition={effectiveTransition}
            >
              <div className={`${round ? 'p-0 m-0' : 'mb-4 p-5'}`}>
                <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060010]">
                  {item.icon}
                </span>
              </div>
              <div className="p-5 w-full">
                <div className="mb-1 font-black text-lg text-white">{item.title}</div>
                <p className="text-sm text-white mb-4">{item.description}</p>
                {item.title === 'Spotify' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSpotifyConnected) handleConnectSpotify();
                    }}
                    className={`w-full py-2 px-4 rounded-full font-bold transition-all ${isSpotifyConnected
                      ? 'bg-green-500/20 text-green-500 border border-green-500/50 cursor-default'
                      : 'bg-[#1DB954] text-black hover:scale-105 active:scale-95 cursor-pointer'
                      }`}
                  >
                    {isSpotifyConnected ? 'Connecté' : 'Se connecter'}
                  </button>
                )}
              </div>

            </motion.div>
          );
        })}
      </motion.div>
      <div className={`flex w-full justify-center ${round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''}`}>
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${currentIndex % items.length === index
                ? round
                  ? 'bg-white'
                  : 'bg-[#333333]'
                : round
                  ? 'bg-[#555]'
                  : 'bg-[rgba(51,51,51,0.4)]'
                }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
