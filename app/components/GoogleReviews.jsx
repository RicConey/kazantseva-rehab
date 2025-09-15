// app/components/GoogleReviews.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Reviews.module.css';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        const filteredReviews = data.filter(r => r.text && (r.rating === 5 || r.rating === 4));
        setReviews(filteredReviews);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      });
  }, []);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  if (isLoading) {
    return <div className={styles.loading}>Завантаження відгуків...</div>;
  }

  if (reviews.length === 0) {
    return null;
  }

  const activeReview = reviews[currentIndex];

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.title}>Відгуки клієнтів</h2>
      <div className={styles.slider}>
        <div className={styles.reviewWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={styles.reviewCard}
            >
              <div className={styles.cardHeader}>
                <img
                  src={activeReview.profile_photo_url}
                  alt={activeReview.author_name}
                  className={styles.authorImage}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>{activeReview.author_name}</p>
                  <div className={styles.rating}>
                    {[...Array(activeReview.rating)].map((_, i) => (
                      <FiStar key={i} className={styles.star} />
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.reviewText}>"{activeReview.text}"</p>
              <p className={styles.reviewDate}>{activeReview.relative_time_description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Блок управления вынесен под слайдер --- */}
      <div className={styles.navigationControls}>
        <button onClick={handlePrev} className={styles.navButton} aria-label="Previous review">
          <FiChevronLeft />
        </button>
        <button onClick={handleNext} className={styles.navButton} aria-label="Next review">
          <FiChevronRight />
        </button>
      </div>

      <div className={styles.googleLinkContainer}>
        <a
          href={`https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.googleLink}
        >
          Читати всі відгуки на Google
        </a>
      </div>
    </div>
  );
}
