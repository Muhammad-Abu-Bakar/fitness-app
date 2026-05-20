// === NEW === extracted from app/(tabs)/profile.tsx so onboarding sex step can reuse it
import Svg, { Circle, Path } from 'react-native-svg';
import type { Sex } from '../context/onboarding';

export function AvatarSvg({
  sex,
  color,
  size,
}: {
  sex: Sex | null;
  color: string;
  size: number;
}) {
  if (sex === 'male') {
    return (
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        <Path d="M 18 100 L 18 75 Q 18 60 50 60 Q 82 60 82 75 L 82 100 Z" fill={color} />
        <Circle cx="50" cy="38" r="18" fill={color} />
      </Svg>
    );
  }
  if (sex === 'female') {
    return (
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        <Path
          d="M 28 50 Q 28 18 50 18 Q 72 18 72 50 L 72 56 Q 50 60 28 56 Z"
          fill={color}
          opacity={0.55}
        />
        <Circle cx="50" cy="38" r="16" fill={color} />
        <Path d="M 24 100 L 24 76 Q 24 62 50 62 Q 76 62 76 76 L 76 100 Z" fill={color} />
      </Svg>
    );
  }
  return (
    <Svg viewBox="0 0 100 100" width={size} height={size}>
      <Path d="M 20 100 L 20 76 Q 20 60 50 60 Q 80 60 80 76 L 80 100 Z" fill={color} opacity={0.4} />
      <Circle cx="50" cy="38" r="17" fill={color} opacity={0.4} />
    </Svg>
  );
}
