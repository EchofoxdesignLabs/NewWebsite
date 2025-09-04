import { WORKS } from "../components/features/WorkPage/Hero/WorkPosts"; // Adjust path if needed

/**
 * Filters and prioritizes a list of works to show as "other works".
 * It prioritizes works from the same category before filling with others.
 *
 * @param {string} currentWorkId - The ID of the work to exclude (e.g., 'airfrens').
 * @param {number} limit - The maximum number of works to return.
 * @returns {Array} An array of prioritized work objects.
 */
export function getOtherWorks(currentWorkId, limit = 3) {
  // ✅ NEW: First, only consider works that have a case study link.
  const worksWithCaseStudies = WORKS.filter(work => work.caseStudy);
  // Find the current work to get its category
  const currentWork = worksWithCaseStudies.find(work => work.id === currentWorkId);
  if (!currentWork) {
    // If the ID isn't found, just return the first few works as a fallback
    return WORKS.slice(0, limit);
  }

  const currentCategory = currentWork.category;

  // 1. Filter out the current work from the list
  const otherWorks = WORKS.filter(work => work.id !== currentWorkId && work.caseStudy);

  // 2. Separate the remaining works into two groups
  const sameCategoryWorks = otherWorks.filter(work => work.category === currentCategory);
  const differentCategoryWorks = otherWorks.filter(work => work.category !== currentCategory);

  // 3. Combine the lists (same category is prioritized)
  const prioritizedList = [...sameCategoryWorks, ...differentCategoryWorks];
  
  // 4. Return the first 'limit' items from the combined list
  return prioritizedList.slice(0, limit);
}