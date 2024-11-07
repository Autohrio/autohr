// Create a new file: src/layouts/PublicLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Header from './home/components/header';
import Footer from './home/components/footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </motion.div>
  );
};

export default PublicLayout;