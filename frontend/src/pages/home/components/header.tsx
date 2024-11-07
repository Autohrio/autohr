import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleAuthNavigation = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleNavigation = async (href: string, sectionId?: string) => {
    if (location.pathname !== href) {
      // Navigate and scroll after the navigation is complete
      navigate(href, {
        state: { scrollTo: sectionId }
      });
    } else if (sectionId) {
      // If we're already on the page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const navItems = [
    { title: "About", href: "/about-us" },
    { title: "Coverage", href: "/about-us", sectionId: "news-section" },
    { title: "Resources", href: "/" },
    { title: "Pricing", href: "/pricing" }
  ];

  // Animation variants remain the same
  const headerVariants = {
    initial: { y: -100 },
    animate: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5
      }
    }),
    hover: {
      y: -2,
      color: "#a5b4fc",
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.header
      className="text-white"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          Auto<motion.span
            className='text-[#FF8D60]'
            animate={{
              color: ['#FF8D60', '#FFB088', '#FF8D60'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >Hr.</motion.span>
        </motion.div>

        <nav className="hidden md:flex space-x-4">
          {navItems.map((item, i) => (
            <motion.a
              key={item.title}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href, item.sectionId);
              }}
              href={item.href}
              className="hover:text-indigo-300 cursor-pointer"
              variants={navItemVariants}
              custom={i}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {item.title}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <motion.button
            className="btn btn-primary"
            onClick={handleAuthNavigation}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            {user ? 'Dashboard' : 'Sign Up / Sign In'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;