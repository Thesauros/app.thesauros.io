import { useTheme } from '../../theme';

export const TwitterIcon = () => {
  const { theme } = useTheme();
  const containerColor = theme === 'dark' ? '#0F1419' : '#F4F8FE';
  const iconColor = theme === 'dark' ? '#FCFCFC' : '#010101';

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="10" fill={containerColor} />
      <path
        d="M4.05607 4.41016L8.6679 10.5763L4.02734 15.5898H5.07205L9.13525 11.2006L12.4179 15.5898H15.9724L11.1013 9.0768L15.421 4.41016H14.3763L10.6347 8.45248L7.61129 4.41016H4.05677H4.05607ZM5.59194 5.17952H7.22451L14.4351 14.8204H12.8026L5.59194 5.17952Z"
        fill={iconColor}
      />
    </svg>
  );
};
