// app/components/AnimatedText.js
'use client';
import { useEffect, useRef, useState, forwardRef, useCallback, useImperativeHandle } from 'react';

const AnimatedText = forwardRef(({ children, triggerOnMount = false, type = 'default', className = '', ...props }, ref) => {
  const textRef = useRef(null);
  const animatorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize animation
  const initAnimation = useCallback(async () => {
    if (!textRef.current || !window.gsap || !window.SplitType) return false;

    try {
      console.log(`AnimatedText: Initializing ${type} animation`);
      
      if (type === 'project') {
        const { ProjectTextAnimator } = await import('../../public/js/effect-3/project-text-animator.js');
        console.log('AnimatedText: ProjectTextAnimator loaded');
        animatorRef.current = new ProjectTextAnimator(textRef.current);
      } else {
        const { TextAnimator } = await import('../../public/js/effect-3/text-animator.js');
        console.log('AnimatedText: TextAnimator loaded');
        animatorRef.current = new TextAnimator(textRef.current);
      }
      
      console.log(`AnimatedText: ${type === 'project' ? 'ProjectText' : 'Text'}Animator initialized`, animatorRef.current);
      return true;
    } catch (error) {
      console.error('AnimatedText: Error initializing animation:', error);
      return false;
    }
  }, [type]);

  // Memoize the animate function to prevent unnecessary recreations
  const animate = useCallback(async () => {
    console.log('AnimatedText: animate() called via ref', {
      hasAnimator: !!animatorRef.current,
      hasAnimateMethod: animatorRef.current ? typeof animatorRef.current.animate === 'function' : false,
      text: textRef.current?.textContent
    });
    
    // If animator is ready, call animate directly
    if (animatorRef.current && typeof animatorRef.current.animate === 'function') {
      console.log('AnimatedText: Calling animator.animate()');
      const result = await animatorRef.current.animate();
      console.log('AnimatedText: animator.animate() completed', { success: !!result });
      return result;
    } 
    
    // If not ready but SplitType is available, try to initialize
    if (window.SplitType) {
      console.log('AnimatedText: SplitType available, initializing animation');
      try {
        await initAnimation();
        if (animatorRef.current?.animate) {
          return animatorRef.current.animate();
        }
      } catch (error) {
        console.error('AnimatedText: Error during initialization:', error);
      }
    } else {
      console.log('AnimatedText: SplitType not available yet, will retry...');
      // Wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 100));
      if (window.SplitType) {
        return ref.current?.animate();
      }
    }
    
    console.log('AnimatedText: Animation not ready', {
      animatorReady: !!animatorRef.current,
      hasTextElement: !!textRef.current,
      splitTypeAvailable: !!window.SplitType,
      gsapAvailable: !!window.gsap
    });
    return false;
  }, [initAnimation, ref]);

  // Expose animate method to parent
  useImperativeHandle(ref, () => ({
    animate: animate
  }), [animate]);

  // Check if SplitType is available
  useEffect(() => {
    const checkSplitType = () => {
      if (window.SplitType) {
        console.log('AnimatedText: SplitType is now available');
        setIsReady(true);
      } else {
        console.log('AnimatedText: Waiting for SplitType...');
        setTimeout(checkSplitType, 100);
      }
    };

    // Initial check
    if (window.SplitType) {
      console.log('AnimatedText: SplitType already available on mount');
      setIsReady(true);
    } else {
      console.log('AnimatedText: SplitType not yet available, starting polling...');
      checkSplitType();
    }
  }, []);

  // Initialize animation when ready
  useEffect(() => {
    if (isReady) {
      initAnimation();
    }
  }, [isReady, initAnimation]);

  // Trigger animation on mount if requested
  useEffect(() => {
    if (triggerOnMount && isReady) {
      const timer = setTimeout(() => {
        if (animatorRef.current?.animate) {
          console.log('AnimatedText: Triggering animation on mount');
          animatorRef.current.animate();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isReady, triggerOnMount]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (textRef.current) {
        // Clone the node to remove all event listeners
        const newElement = textRef.current.cloneNode(true);
        textRef.current.parentNode?.replaceChild(newElement, textRef.current);
      }
    };
  }, []);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
});

AnimatedText.displayName = 'AnimatedText';

export default AnimatedText;

