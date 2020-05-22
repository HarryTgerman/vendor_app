import { useState, useEffect } from 'react';

        
function getScrollValue (){
    const {scrollY: scrollValue} = window;
    return {scrollValue}
};

export default function useScrollValue() {
  const [scrollValue, setScrollValue] = useState(getScrollValue());

  useEffect(() => {
    function handleScroll() {
      setScrollValue(getScrollValue());
    }


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollValue;
}