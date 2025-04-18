import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrefetch } from '../../hooks';

/**
 * Enhanced Link component for SPA navigation
 * Prefetches data when link is hovered or comes into view
 */
const SpaLink = ({ 
  to, 
  prefetchEndpoints = [],
  prefetchOnHover = true,
  prefetchOnVisible = true,
  children,
  ...props 
}) => {
  const prefetch = usePrefetch();
  const navigate = useNavigate();
  
  const handlePrefetch = () => {
    if (prefetchEndpoints && prefetchEndpoints.length > 0) {
      prefetch(prefetchEndpoints);
    }
  };
  
  const handleClick = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
    
    if (!e.defaultPrevented) {
      e.preventDefault();
      
      // Prefetch data immediately if not already prefetched
      handlePrefetch();
      
      // Navigate after a short delay to allow prefetch to start
      setTimeout(() => {
        navigate(to);
      }, 10);
    }
  };
  
  // Setup visibility observer if needed
  React.useEffect(() => {
    if (prefetchOnVisible && prefetchEndpoints.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handlePrefetch();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      const linkElement = document.querySelector(`a[href="${to}"]`);
      if (linkElement) {
        observer.observe(linkElement);
      }
      
      return () => {
        if (linkElement) {
          observer.unobserve(linkElement);
        }
        observer.disconnect();
      };
    }
  }, [prefetchOnVisible, to]);
  
  const linkProps = {
    ...props,
    to,
    onClick: handleClick,
    ...(prefetchOnHover ? { onMouseEnter: handlePrefetch } : {})
  };
  
  return <Link {...linkProps}>{children}</Link>;
};

export default SpaLink; 