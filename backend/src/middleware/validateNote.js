export const validateNote = (req, res, next) => {
    const { title, content } = req.body;

    // For PUT requests, only validate if title or content is being updated
    if (req.method === 'PUT') {
        // If title is being updated, validate it
        if (title !== undefined) {
            if (!title || title.trim().length === 0) {
                return res.status(400).json({
                    message: 'Title cannot be empty'
                });
            }
        }

        // If content is being updated, validate it
        if (content !== undefined) {
            if (!content || content.trim().length === 0) {
                return res.status(400).json({
                    message: 'Content cannot be empty'
                });
            }
        }
    } else {
        // For POST requests, both title and content are required
        if (!title || !content) {
            return res.status(400).json({
                message: 'Title and content are required'
            });
        }

        if (title.trim().length === 0 || content.trim().length === 0) {
            return res.status(400).json({
                message: 'Title and content cannot be empty'
            });
        }
    }

    next();
}; 