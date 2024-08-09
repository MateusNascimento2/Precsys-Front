import React from 'react';
import { useSpring, animated } from 'react-spring';

const useAnimatedNumber = (value) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 100,
    config: { mass: 1, tension: 150, friction: 30 },
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL'
    }).format(num);
  };

  return <animated.span>{number.to(n => formatNumber(n.toFixed(2)))}</animated.span>;
};

export default useAnimatedNumber;