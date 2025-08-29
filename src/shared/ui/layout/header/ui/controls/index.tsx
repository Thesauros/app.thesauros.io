import { FlexBlock } from '@/shared/ui/flex-block';
import { Moon } from '@shared/ui/icons/moon';
import { Button } from '@/shared/ui/button';
import { AppTheme, useTheme } from '@/shared/ui/theme';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const Controls = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useCheckResolution(576);

  const toggleTheme = () => {
    setTheme(theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  };

  return (
    <FlexBlock gap={14} alignItems="center">
      {!isMobile && <Moon onClick={toggleTheme} />}
      <Button variant="primary" size="s">
        Deposit
      </Button>
      <Button variant="secondary" size="s">
        Withdraw
      </Button>
    </FlexBlock>
  );
};
