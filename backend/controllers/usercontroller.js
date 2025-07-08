import User from '../models/usermodel.js';
import { sendError } from '../helpers/errorHandler.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 

    const user = await User.findById(userId).select('profilePhoto email name');

    if (!user) return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');

    res.status(200).json({
      profilePhoto: user.profilePhoto,
      name: user.name,         // optional
      email: user.email        // optional
    });
  } catch (error) {
    sendError(res, 500, 'Failed to fetch /user', 'FETCH_USER_FAILED');
  }
};
