CREATE TABLE "PortfolioView" (
    "id" TEXT NOT NULL,
    "portfolioUserId" TEXT NOT NULL,
    "visitorKeyHash" TEXT NOT NULL,
    "firstViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PortfolioView_portfolioUserId_visitorKeyHash_key"
ON "PortfolioView"("portfolioUserId", "visitorKeyHash");

CREATE INDEX "PortfolioView_portfolioUserId_idx"
ON "PortfolioView"("portfolioUserId");

ALTER TABLE "PortfolioView"
ADD CONSTRAINT "PortfolioView_portfolioUserId_fkey"
FOREIGN KEY ("portfolioUserId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
