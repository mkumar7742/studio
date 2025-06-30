
const jwt = require('jsonwebtoken');
const Member = require('../../models/member');
const Role = require('../../models/role');

module.exports = async function(req, res, next) {
    // Get token from header
    const authHeader = req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret');
        
        // Find user and role to attach permissions
        const member = await Member.findById(decoded.member.id);
        if (!member) {
             return res.status(401).json({ msg: 'Token is not valid' });
        }
        
        const role = await Role.findById(member.roleId);
        if (!role) {
            // This case might happen if a role is deleted while a user is logged in
            return res.status(403).json({ msg: 'User role not found, authorization denied.' });
        }
        
        req.member = { ...member.toObject(), permissions: role.permissions };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
