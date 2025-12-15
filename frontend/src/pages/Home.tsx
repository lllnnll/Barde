import Carousel, { CarouselItem } from '../components/Carousel';
import Orb from '../components/Orb';
import Aurora from '../components/Auror';
import { useRef, useState, useEffect } from 'react';
//TODO Faire plutot 3 case gauche milieu droite qui silumine chaqu'un sont tour et change les couleurs
export default function Home() {
  const [auroraStops, setAuroraStops] = useState<[HexColor, HexColor, HexColor]>(['#1DB954', '#10E67A', '#0A7B3F'] as [HexColor, HexColor, HexColor]);
  const [baseWidth, setBaseWidth] = useState<number>(480);
  const animRef = useRef<number | null>(null);
  const TRANSITION_MS = 500;
  (() => {})();

  // Ajuste dynamiquement la largeur de base selon la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      // 80% de la largeur viewport, plafonné à 500px
      setBaseWidth(Math.min(500, Math.round(w * 0.8)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
    return (
        <>
            {/* Background Aurora */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <Aurora amplitude={1.0} blend={0.6} colorStops={auroraStops} />
            </div>
            <h1 className='text-white '>Play music with your friends between these platforms</h1>
            <div
              style={{ position: 'fixed', inset: 0 }}
              className="w-full h-full flex items-center justify-center z-10"
            >
                <div className="w-full max-w-[800px] aspect-square flex items-center justify-center px-4 sm:px-0">
                    <Orb
                        hoverIntensity={0.2}
                        rotateOnHover={true}
                        hue={0}
                        forceHoverState={false}
                    >
                        <Carousel
                      baseWidth={baseWidth}
                            autoplay={true}
                            autoplayDelay={3000}
                            pauseOnHover={true}
                            loop={true}
                            round={true}
                            onActiveChange={(item) => {
                              if (animRef.current) cancelAnimationFrame(animRef.current);
                              const start = performance.now();
                              const from = auroraStops;
                              const tick = (now: number) => {
                                const t = Math.min(1, (now - start) / TRANSITION_MS);
                                const next = auroraColorProcess(item.title, from, t);
                                setAuroraStops(next);
                                if (t < 1) {
                                  animRef.current = requestAnimationFrame(tick);
                                } else {
                                  animRef.current = null;
                                }
                              };
                              animRef.current = requestAnimationFrame(tick);
                            }}
                        />
                    </Orb>
                </div>
              {/* Bottom heading under the orb */}
              <div className="absolute left-0 right-0 flex justify-center bottom-4 md:bottom-6">
                <h1 className='text-white'>Try it now !</h1>
              </div>
            </div>
        </>
    )
}

function auroraColorProcess(
  actualPlatform: string,
  startStops: [HexColor, HexColor, HexColor],
  t: number
): [HexColor, HexColor, HexColor] {
  const key = (actualPlatform || '').trim().toLowerCase();
  const target: [HexColor, HexColor, HexColor] = (() => {
    switch (key) {
      case 'spotify':
        return ['#1DB954', '#10E67A', '#0A7B3F'] as [HexColor, HexColor, HexColor];
      case 'apple music':
        // Apple Music gradient-inspired palette
        return ['#FF2D55', '#FF3B30', '#FF9F0A'] as [HexColor, HexColor, HexColor];
      case 'deezer':
        // Deezer cyan → purple → magenta
        return ['#00C7F2', '#7C4DFF', '#FF4B8B'] as [HexColor, HexColor, HexColor];
      default:
        return ['#5227FF', '#7CFF67', '#5227FF'] as [HexColor, HexColor, HexColor];
    }
  })();
  return transitionThreeColors(startStops, target, Math.max(0, Math.min(1, t)));
}

type HexColor = `#${string}`;

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: HexColor): RGB {
  const num = parseInt(hex.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex({ r, g, b }: RGB): HexColor {
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
  ) as HexColor;
}

const lerp = (a: number, b: number, t: number) =>
  Math.round(a + (b - a) * t);

function mixColors(fromHex: HexColor, toHex: HexColor, t: number): HexColor {
  const a = hexToRgb(fromHex);
  const b = hexToRgb(toHex);
  return rgbToHex({
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t)
  });
}

/**
 * Transition between 3 starting hex colors and 3 ending hex colors.
 * 
 * @param startColors - array of 3 starting hex colors
 * @param endColors - array of 3 target hex colors
 * @param t - transition progress (0 ↔ 1)
 */
export function transitionThreeColors(
  startColors: [HexColor, HexColor, HexColor],
  endColors: [HexColor, HexColor, HexColor],
  t: number
): [HexColor, HexColor, HexColor] {
  return [
    mixColors(startColors[0], endColors[0], t),
    mixColors(startColors[1], endColors[1], t),
    mixColors(startColors[2], endColors[2], t)
  ];
}
