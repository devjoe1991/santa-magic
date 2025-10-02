"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

// Flying Santa will be added via useEffect

const COLORS_TOP = ["#FF0000", "#00FF00", "#FF3333", "#00CC00"];

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });

    // Load flying-santa component from CDN
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@divriots/flying-santa/dist/index.js?module';
    document.head.appendChild(script);
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid h-[50vh] place-content-center overflow-hidden bg-gray-950 px-4 py-6 text-gray-200 sm:py-12 landscape:py-4"
    >
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          🎄 AI Magic Available Now!
        </span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-2xl font-medium leading-tight text-transparent sm:text-3xl sm:leading-tight md:text-5xl md:leading-tight lg:text-7xl lg:leading-tight landscape:text-xl landscape:leading-tight">
          <span className="block">Your Doorbell</span>
          <span className="block">Our Magic</span>
        </h1>
        <p className="my-4 max-w-xl text-center text-sm leading-relaxed sm:my-6 sm:text-base md:text-lg md:leading-relaxed landscape:my-2 landscape:text-xs landscape:leading-relaxed">
          Upload your doorbell footage, pay £12.50, and watch Santa arrive at your doorstep using AI magic. 
          <span className="block mt-2 font-semibold text-white">Create Christmas memories that last forever!</span>
        </p>
        <motion.a
          href="/order"
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-3 py-2 text-gray-50 transition-colors hover:bg-gray-950/50 sm:px-4 landscape:px-2 landscape:py-1 landscape:text-sm"
        >
          <span className="text-sm sm:text-base landscape:text-xs">🎅 See Santa Today!</span>
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12 text-sm sm:text-base landscape:text-xs" />
        </motion.a>
      </div>

      <div className="absolute inset-0 z-0">
        {/* Background Video */}
        <video
          src="/babccb0b-d338-402a-ba35-dc1f20d887b9 (1).mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          style={{
            filter: "blur(1px) brightness(0.8) contrast(1.2)"
          }}
        />
        
        {/* 3D Stars Overlay */}
        <div className="absolute inset-0">
          <Canvas>
            <Stars radius={50} count={2500} factor={4} fade speed={2} />
          </Canvas>
        </div>
      </div>

      {/* Flying Santa Component - Hidden for now */}
      {/* <flying-santa 
        change-speed="8000"
        speed="0.8"
        presents-distance="120"
        presents-interval="300"
        presents-drop-speed="0.6"
        className="hidden sm:block"
        style={{
          width: 'clamp(120px, 15vw, 180px)',
          height: 'auto',
          position: 'absolute',
          zIndex: 5
        }}
      /> */}

      {/* Fade Out Gradient - Removed for overlapping text */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" /> */}
    </motion.section>
  );
};
