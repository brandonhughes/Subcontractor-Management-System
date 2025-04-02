/**
 * This file contains patch notes for backend code that needs to be fixed.
 * Since we don't have direct access to edit backend files in this environment,
 * use this as documentation for changes needed on the backend.
 */

/**
 * ISSUE: Review count not updating on the subcontractor cards
 * 
 * In review.controller.js, the calculateScore function has a critical bug:
 * 
 * 1. It's updating a field called "rating" instead of "averageRating" which is the actual
 *    field name in the Subcontractor model
 * 
 * 2. It's not updating the reviewCount field at all
 * 
 * Fix in calculateScore function (around line 102-109 in review.controller.js):
 * 
 * // Update subcontractor rating
 * await Subcontractor.update(
 *   {
 *     averageRating: normalizedScore, // Changed from "rating" to "averageRating"
 *     letterGrade,
 *     reviewCount: reviews.length     // Add this line to update the review count
 *   },
 *   {
 *     where: { id: subcontractorId }
 *   }
 * );
 */