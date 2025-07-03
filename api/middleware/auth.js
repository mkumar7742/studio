
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
        
        // Find user
        const member = await Member.findById(decoded.member.id);
        if (!member) {
             return res.status(401).json({ msg: 'Token is not valid' });
        }
        
        const role = await Role.findById(member.roleId);
        if (!role) {
            return res.status(403).json({ msg: 'User role not found, authorization denied.' });
        }

        // Handle System Administrator separately (no family checks)
        if (role.name === 'System Administrator') {
            req.member = { ...member.toObject(), permissions: role.permissions };
            return next();
        }
        
        // --- Standard User Family Checks ---
        if (member.familyId?.toString() !== decoded.member.familyId) {
             return res.status(401).json({ msg: 'Token is not valid (family mismatch)' });
        }
        if (role.familyId?.toString() !== member.familyId.toString()) {
            return res.status(403).json({ msg: 'User role is not valid for this family.' });
        }
        
        // Attach the full member object (including familyId) and their permissions to the request
        req.member = { ...member.toObject(), permissions: role.permissions };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
