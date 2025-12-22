'use client';

import Image from 'next/image';

export default function Logo2D({ className = '' }) {
  return (
    <div className={className} style={{ width: 350, height: 250 }}>
      <Image 
        src="/images/jp.svg"
        alt="Jan Peiro Logo"
        width={350}
        height={250}
        priority
      />
    </div>
  );
}
