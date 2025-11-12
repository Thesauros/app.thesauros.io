export const PointCoinIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      style={{ minWidth: size }}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="7.5"
        fill="url(#paint0_linear_126_2043)"
        stroke="url(#paint1_linear_126_2043)"
      />
      <path
        d="M5.57485 4C4.33689 4 3.33333 4.98898 3.33333 6.20895H6.87924V7.68963C6.87924 6.87188 7.55193 6.20895 8.38174 6.20895H10.4251C11.6631 6.20895 12.6667 5.21997 12.6667 4L5.57485 4Z"
        fill="white"
      />
      <path
        d="M6.87924 7.68963L6.87912 10.4577C6.87912 11.6777 7.88267 12.6667 9.12063 12.6667V6.20897L8.38174 6.20895C7.55193 6.20895 6.87924 6.87188 6.87924 7.68963Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_126_2043"
          x1="8"
          y1="16"
          x2="8"
          y2="1.33333"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#196BFF" />
          <stop offset="1" stopColor="#689EFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_126_2043"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.441075" stopColor="#6FA5FD" />
          <stop offset="1" stopColor="#004DD6" />
        </linearGradient>
      </defs>
    </svg>
  );
};
