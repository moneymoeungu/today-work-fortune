"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/asset";

interface OwlProps {
  /** 유형별 캐릭터 이미지 경로 (없으면 기준 부엉이로 대체) */
  src?: string;
  size?: number;
  alt: string;
  float?: boolean;
  priority?: boolean;
  className?: string;
  /** 이미지가 없을 때만 쓰이는 임시 이모지 소품 */
  hat?: string;
  prop?: string;
}

const FALLBACK = "/assets/owl/fortune-teller-owl.png";

/**
 * 부엉이 캐릭터.
 * 실제 의상 이미지(/assets/owl/{id}.png)가 있으면 그대로(투명 배경) 보여주고,
 * 없으면 기본 점술가 부엉이 이미지로 대신한다.
 */
export default function Owl({
  src,
  hat,
  prop,
  size = 240,
  alt,
  float = false,
  priority = false,
  className = "",
}: OwlProps) {
  const [failed, setFailed] = useState(false);
  const useReal = !!src && !failed;
  const resolvedSrc = assetUrl(useReal ? src! : FALLBACK);

  return (
    <div className={`relative shrink-0 ${float ? "float" : ""} ${className}`} style={{ width: size, height: size }}>
      {useReal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          width={size}
          height={size}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          draggable={false}
          className="h-full w-full object-contain"
          style={{ filter: "drop-shadow(0 16px 24px rgba(15, 6, 38, 0.55))" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedSrc}
            alt={alt}
            width={size}
            height={size}
            draggable={false}
            className="h-full w-full object-contain"
            style={{ filter: "drop-shadow(0 16px 24px rgba(15, 6, 38, 0.55))" }}
          />
          {hat && (
            <span aria-hidden className="absolute left-1/2 -translate-x-1/2 leading-none" style={{ top: -size * 0.1, fontSize: size * 0.26 }}>
              {hat}
            </span>
          )}
          {prop && (
            <span aria-hidden className="absolute leading-none drop-shadow-lg" style={{ right: -size * 0.04, bottom: size * 0.02, fontSize: size * 0.26 }}>
              {prop}
            </span>
          )}
        </>
      )}
    </div>
  );
}
