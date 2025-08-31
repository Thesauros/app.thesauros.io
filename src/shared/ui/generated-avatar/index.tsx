import React from 'react';
import styles from './generated-avatar.module.scss';
import Image from 'next/image';

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // convert to 32bit integer
  }
  return Math.abs(hash);
};

const generateAvatar = (seed: string, size = 5, scale = 50): string => {
  const hash = stringToHash(seed);
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d')!;

  // background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // color from hash
  const color = `hsl(${hash % 360}, 60%, 50%)`;

  // 5x5 grid
  for (let x = 0; x < Math.ceil(size / 2); x++) {
    for (let y = 0; y < size; y++) {
      const bit = (hash >> (x * size + y)) & 1;
      if (bit) {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
        ctx.fillRect((size - 1 - x) * scale, y * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL();
};

export const Avatar: React.FC<{ value: string }> = ({ value }) => {
  const src = generateAvatar(value);
  return (
    <div className={styles.container}>
      <Image src={src} alt={value} className={styles.avatar} />
    </div>
  );
};
