export const PERMISSIONS = {
  Customers: {
    Create: "customers_create",
    Modify: "customers_modify",
    Read: "customers_read",
  },
  Finance: {
    Create: "finance_create",
    Modify: "finance_modify",
    Read: "finance_read",
  },
  Inventory: {
    Create: "inventory_create",
    Modify: "inventory_modify",
    Read: "inventory_read",
  },
  Product: {
    Create: "product_create",
    Modify: "product_modify",
    Read: "product_read",
  },
  Purchases: {
    Create: "purchases_create",
    Modify: "purchases_modify",
    Read: "purchases_read",
  },
  Sales: {
    Create: "sales_create",
    Modify: "sales_modify",
    Read: "sales_read",
  },
  Suppliers: {
    Create: "suppliers_create",
    Modify: "suppliers_modify",
    Read: "suppliers_read",
  },
  User: {
    Create: "user_create",
    Modify: "user_modify",
    Read: "user_read",
  },
  Role: {
    Create: "role_create",
    Modify: "role_modify",
    Read: "role_read",
  },
} as const;