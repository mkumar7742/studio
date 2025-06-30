
const express = require('express');
const router = express.Router();

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
    group: 'Trips',
    permissions: [
      { id: 'trips:view', label: 'View Trips' },
      { id: 'trips:create', label: 'Create Trips' },
    ],
  },
  {
    group: 'Approvals',
    permissions: [
      { id: 'approvals:view', label: 'View Approvals' },
      { id: 'approvals:action', label: 'Action Approvals' },
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
    group: 'Budgets',
    permissions: [{ id: 'budgets:manage', label: 'Manage Budgets' }],
  },
  {
    group: 'Calendar',
    permissions: [{ id: 'calendar:view', label: 'View Calendar' }],
  },
  {
    group: 'Subscriptions',
    permissions: [{ id: 'subscriptions:view', label: 'View Subscriptions' }],
  },
];

router.get('/', (req, res) => {
    res.json(allPermissions);
});

module.exports = router;
