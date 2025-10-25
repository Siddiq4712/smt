// C:\Study Materials\III Year\smt\smt\backend\migrations\20251025103610-addBlockchainHashesToReviews.cjs
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn('Reviews', 'originalBlockHash', {
      type: Sequelize.STRING(64),
      allowNull: true,
      unique: false,
    });

    await queryInterface.addColumn('Reviews', 'previousBlockHash', {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    // Fetch existing reviews
    const existingReviews = await queryInterface.sequelize.query(
      'SELECT id, movieTitle, reviewText, rating, userId, createdAt FROM Reviews',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const crypto = require('crypto');
    const calculateHash = (data) =>
      crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

    // Process each review
    for (const review of existingReviews) {
      const previousBlockHashForExisting = '0';

      const blockData = {
        id: review.id,
        movieTitle: review.movieTitle,
        reviewText: review.reviewText,
        rating: review.rating,
        userId: review.userId,
        createdAt: review.createdAt,
        previousBlockHash: previousBlockHashForExisting,
      };

      let originalBlockHash;
      try {
        originalBlockHash = calculateHash(blockData);
      } catch (hashError) {
        console.error(`Error generating hash for review ID ${review.id}:`, hashError.message);
        throw hashError;
      }

      await queryInterface.sequelize.query(
        'UPDATE Reviews SET originalBlockHash = :originalHash, previousBlockHash = :previousHash WHERE id = :id',
        {
          replacements: {
            originalHash: originalBlockHash,
            previousHash: previousBlockHashForExisting,
            id: review.id,
          },
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    // Update column constraints after populating
    await queryInterface.changeColumn('Reviews', 'originalBlockHash', {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn('Reviews', 'previousBlockHash', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reviews', 'previousBlockHash');
    await queryInterface.removeColumn('Reviews', 'originalBlockHash');
  },
};
