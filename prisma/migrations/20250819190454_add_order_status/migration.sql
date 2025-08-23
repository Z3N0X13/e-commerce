-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "apartment" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "nameOnCard" TEXT,
    "cardNumber" TEXT,
    "expiry" TEXT,
    "cvc" TEXT,
    "rememberMe" BOOLEAN NOT NULL DEFAULT false,
    "useShippingAsBilling" BOOLEAN NOT NULL DEFAULT true,
    "shippingPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("address", "apartment", "cardNumber", "city", "country", "createdAt", "cvc", "email", "expiry", "firstName", "id", "lastName", "nameOnCard", "paymentMethod", "postalCode", "rememberMe", "shippingPrice", "subtotal", "total", "useShippingAsBilling", "userId") SELECT "address", "apartment", "cardNumber", "city", "country", "createdAt", "cvc", "email", "expiry", "firstName", "id", "lastName", "nameOnCard", "paymentMethod", "postalCode", "rememberMe", "shippingPrice", "subtotal", "total", "useShippingAsBilling", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
