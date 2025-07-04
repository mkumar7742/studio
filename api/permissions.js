
const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');

const allPermissions = [
  {
    group: 'Dashboard',
    permissions: [{ id: 'dashboard:view', label: 'View Dashboard' }],
  },
  {
    group: 'Expenses',
    permissions: [
      { id: 'expenses:view', label: 'View Expenses' },
      { id: 'expenses:create', label: 'Create Expenses' },
      { id: 'expenses:edit', label: 'Edit Expenses' },
      { id: 'expenses:delete', label: 'Delete Expenses' },
    ],
  },
  {
    group: 'Income',
    permissions: [
      { id: 'income:view', label: 'View Income' },
      { id: 'income:create', label: 'Create Income' },
      { id: 'income:edit', label: 'Edit Income' },
      { id: 'income:delete', label: 'Delete Income' },
    ],
  },
   {
    group: 'Approvals',
    permissions: [
      { id: 'approvals:request', label: 'Request expense approvals' },
      { id: 'approvals:manage', label: 'Manage expense approvals' },
    ],
  },
  {
    group: 'Budgets',
    permissions: [
      { id: 'budgets:view', label: 'View Budgets' },
      { id: 'budgets:manage', label: 'Manage Budgets' },
    ],
  },
  {
    group: 'Categories',
    permissions: [
      { id: 'categories:view', label: 'View Categories' },
      { id: 'categories:create', label: 'Create Categories' },
      { id: 'categories:edit', label: 'Edit Categories' },
      { id: 'categories:delete', label: 'Delete Categories' },
    ],
  },
  {
    group: 'Members',
    permissions: [
      { id: 'members:view', label: 'View Members' },
      { id: 'members:create', label: 'Create Members' },
      { id: 'members:edit', label: 'Edit Members' },
      { id: 'members:delete', label: 'Delete Members' },
    ],
  },
  {
    group: 'Roles',
    permissions: [{ id: 'roles:manage', label: 'Manage Roles & Permissions' }],
  },
  {
    group: 'Calendar',
    permissions: [{ id: 'calendar:view', label: 'View Calendar' }],
  },
  {
    group: 'Audit Log',
    permissions: [{ id: 'audit:view', label: 'View Audit Log' }],
  },
];

router.get('/', auth, (req, res) => {
    res.json(allPermissions);
});

module.exports = router;
