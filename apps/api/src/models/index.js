import { getDatabases } from "../config/databases.js";
import { createCatalogModels } from "./catalogModels.js";
import { createUsersModels } from "./usersModels.js";
import { createOrdersModels } from "./ordersModels.js";
import { createAdminModels } from "./adminModels.js";

export function getModels() {
  const dbs = getDatabases();
  return {
    ...createCatalogModels(dbs.catalog),
    ...createUsersModels(dbs.users),
    ...createOrdersModels(dbs.orders),
    ...createAdminModels(dbs.admin),
  };
}
